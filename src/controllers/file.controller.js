const { HttpError } = require("../httpError");
const path = require("path");
const fs = require("fs/promises");
const { updateUserAvatar } = require("../models/users");

const uploadAvatar = async (req, res, next) => {
  const { filename } = req.file;
  const { _id: userId } = req.user;

  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const newPath = path.resolve(__dirname, "../public/avatars", filename);

  try {
    await fs.rename(tmpPath, newPath);
    const user = await updateUserAvatar(userId, filename);
    res.status(200).json({ data: { image: user.avatarURL } });
  } catch (error) {
    await fs.unlink(tmpPath);
    return next(new HttpError(error.code, error.message));
  }
};

module.exports = {
  uploadAvatar,
};
