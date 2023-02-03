const { HttpError } = require("../httpError");
const {
  addUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUser,
  verificationUser,
  verificationUserUpdate,
} = require("../models/users");

async function signup(req, res, _) {
  try {
    const { email, password } = req.body;
    const user = await addUser(email, password);
    return res.status(201).json({ user: user });
  } catch (error) {
    throw new HttpError(error.code, error.message);
  }
}

async function verification(req, res) {
  const { verificationToken } = req.params;
  await verificationUser(verificationToken);
  res.status(200).json({ message: "Verification successful" });
}

async function verifyUser(req, res) {
  const { email } = req.body;

  await verificationUserUpdate(email);
  res.status(200).json({ message: `Confirmation email sent to ${email}` });
}

async function login(req, res, _) {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    return res.status(201).json(user);
  } catch (error) {
    throw new HttpError(error.code, error.message);
  }
}

async function current(req, res, next) {
  try {
    const { _id: userId } = req.user;
    const user = await currentUser(userId);
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    return next(new HttpError(error.code, error.message));
  }
}

async function logout(req, res, next) {
  try {
    const { _id: userId } = req.user;
    await logoutUser(userId);
    res.status(200).json({ status: "No Content" });
  } catch (error) {
    return next(new HttpError(error.code, error.message));
  }
}

async function subscription(req, res, next) {
  try {
    const { subscription } = req.body;
    const { _id: userId } = req.user;
    const userUpdate = await updateUser(userId, subscription);
    res.status(201).json({
      status: "Status update was successful",
      user: {
        email: userUpdate.email,
        subscription: userUpdate.subscription,
      },
    });
  } catch (error) {
    return next(new HttpError(error.code, error.message));
  }
}

module.exports = {
  signup,
  login,
  logout,
  current,
  subscription,
  verification,
  verifyUser,
};
