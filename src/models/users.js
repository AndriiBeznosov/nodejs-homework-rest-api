const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const sha256 = require("sha256");
const sgMail = require("@sendgrid/mail");

const { User } = require("../service/schemasMongoose/usersSchemas");
const { HttpError } = require("../httpError");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function addUser(email, password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatar = gravatar.url(email);
  const verificationToken = sha256(email + process.env.JWT_SECRET);

  try {
    const saveUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL: avatar,
      verificationToken,
    });

    const msg = {
      to: email,
      from: "andreyservis@ukr.net", // Use the email address or domain you verified above
      subject: "Thank you for registration",
      text: `Please, confirm your email address POST http://localhost:3000/api/users/verify/${verificationToken}`,
      html: `<h1 style="color:DodgerBlue;">Please, <a style="color:gren;" href='http://localhost:3000/api/users/verify/${verificationToken}'>http://localhost:3000/api/users/verify/${verificationToken}</a> confirm your email address</h1>`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new HttpError(404, error.message);
    }

    return saveUser;
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "User with this email already exists ");
    }
    throw error;
  }
}

async function verificationUserUpdate(email) {
  const user = await User.findOne({ email });

  if (!user || null) {
    throw new HttpError("User not found", 404);
  }

  if (user.verify) {
    throw new HttpError("Verification has already been passed", 400);
  }

  const msg = {
    to: user.email,
    from: "andreyservis@ukr.net",
    subject: "Thank you for registration",
    text: `Please, confirm your email address POST http://localhost:3000/api/users/verify/${user.verificationToken}`,
    html: `<h1 style="color:DodgerBlue;">Please, <a style="color:gren;" href='http://localhost:3000/api/users/verify/${user.verificationToken}'>http://localhost:3000/api/users/verify/${user.verificationToken}</a> confirm your email address</h1>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new HttpError(404, error.message);
  }
}

async function verificationUser(code) {
  const user = await User.findOne({ verificationToken: code });

  if (!user || null) {
    throw new HttpError("User not found", 404);
  }

  const userUpdate = await User.findByIdAndUpdate(
    user._id,
    { verificationToken: null, verify: true },
    { new: true },
  );

  const msg = {
    to: user.email,
    from: "andreyservis@ukr.net",
    subject: "Thank you for registration",
    text: "and easy to do anywhere, even with Node.js",
    html: `<div>
    <h1 style="color:DodgerBlue;">User registration was successful </h1>
    <p>${user.email}</p>
    </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new HttpError(error.message, 401);
  }

  return userUpdate;
}

async function loginUser(email, password) {
  const { JWT_SECRET } = process.env;
  const storedUser = await User.findOne({ email, verify: true });
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

async function updateUserAvatar(userId, filename) {
  const userUpdate = await User.findByIdAndUpdate(
    userId,
    { avatarURL: `/avatars/${filename}` },
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
  updateUserAvatar,
  verificationUser,
  verificationUserUpdate,
};
