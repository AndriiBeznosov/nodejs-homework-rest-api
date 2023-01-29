const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: [6, "password should be at least 6 characters long"],
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: [/[a-z0-9]+@[a-z0-9]/, "user email is not valid"],
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
