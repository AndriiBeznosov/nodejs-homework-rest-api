const express = require("express");
const { tryCatchWrapper } = require("../../helpers");

const {
  signup,
  login,
  logout,
  current,
} = require("../../controllers/users.controller");
const { validateBody, auth } = require("../../middlewares");
const { signupSchema, loginSchema } = require("../../schemas");

const userRouter = express.Router();

userRouter.post("/signup", validateBody(signupSchema), tryCatchWrapper(signup));
userRouter.patch("/login", validateBody(loginSchema), tryCatchWrapper(login));
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));
userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

module.exports = userRouter;
