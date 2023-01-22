const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/usersSchemas");
const { HttpError } = require("../httpError");

async function addUser(email, password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const saveUser = await User.create({ email, password: hashedPassword });
    return saveUser;
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "User with this email already exists ");
    }
    throw error;
  }
}

async function loginUser(email, password) {
  const { JWT_SECRET } = process.env;
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    throw new HttpError(401, "Not authorized");
  }

  const isPaswirdValid = await bcrypt.compare(password, storedUser.password);
  if (!isPaswirdValid) {
    throw new HttpError(401, "Email or password is wrong");
  }
  const payload = { id: storedUser._id, email: storedUser.email };
  const token = await jwt.sign(payload, JWT_SECRET);
  const userUpdate = await User.findByIdAndUpdate(
    storedUser._id,
    { token },
    { new: true },
  );
  return {
    token: userUpdate.token,
    user: {
      email: userUpdate.email,
      subscription: userUpdate.subscription,
    },
  };
}

async function logoutUser(idUser) {
  const userUpdate = await User.findByIdAndUpdate(
    idUser,
    { token: null },
    { new: true },
  );
  if (!userUpdate) {
    throw new HttpError(401, "Not authorized");
  }

  return userUpdate;
}

async function currentUser(idUser) {
  const userUpdate = await User.findById(idUser);
  return userUpdate;
}

async function updateUser(idUser, subscription) {
  const userUpdate = await User.findByIdAndUpdate(
    idUser,
    { subscription },
    { new: true },
  );
  if (!userUpdate) {
    throw new HttpError(401, "Not authorized");
  }

  return userUpdate;
}

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUser,
};
