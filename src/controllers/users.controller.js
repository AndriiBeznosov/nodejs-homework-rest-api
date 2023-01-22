const { HttpError } = require("../httpError");
const {
  addUser,
  loginUser,
  logoutUser,
  currentUser,
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

async function logout(req, res, _) {
  try {
    const { _id: userId } = req.user;
    await logoutUser(userId);
    res.status(204).json({ status: "No Content" });
  } catch (error) {
    throw new HttpError(error.code, error.message);
  }
}

module.exports = {
  signup,
  login,
  logout,
  current,
};
