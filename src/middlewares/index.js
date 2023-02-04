const { HttpError } = require("../httpError");
const jwt = require("jsonwebtoken");
const { User } = require("../service/schemasMongoose/usersSchemas");
const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");

function validateBody(schema) {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError(error.message, 400);
    }
    return next();
  };
}

function validateEmail(schema) {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError("missing required field email", 400);
    }
    return next();
  };
}

function validateQuery(schema) {
  return (req, _, next) => {
    if (Object.keys(req.query).includes("favorite")) {
      const { error } = schema.validate(req.query);
      if (error) {
        throw new HttpError(error.message, 400);
      }
    }
    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return next(new HttpError("token type is not valid", 401));
  }
  if (!token) {
    return next(new HttpError("no token provider", 401));
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    req.user = user._id;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return next(new HttpError("jwt token is not valid", 401));
    }
    return next(new HttpError("no token provider", 401));
  }
  next();
}

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../tmp"),
  filename: function (req, file, cb) {
    const { _id } = req.user;
    cb(null, _id + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
});

async function resizeAvatar(req, res, next) {
  const { path } = req.file;
  try {
    const avatar = await Jimp.read(path);
    const resizedAvatar = avatar.resize(250, 250);
    await resizedAvatar.writeAsync(path);
  } catch (error) {
    throw new HttpError(error.message, 400);
  }

  next();
}

module.exports = {
  validateBody,
  auth,
  validateQuery,
  upload,
  resizeAvatar,
  validateEmail,
};
