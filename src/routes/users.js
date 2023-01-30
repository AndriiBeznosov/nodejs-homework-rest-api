const express = require("express");
const { tryCatchWrapper } = require("../helpers");
const {
  signup,
  login,
  logout,
  current,
  subscription,
} = require("../controllers/users.controller");
const { uploadAvatar } = require("../controllers/file.controller");
const { validateBody, auth, upload, resizeAvatar } = require("../middlewares");
const { signupSchema, loginSchema, subscriptionSchema } = require("../schemas");

const userRouter = express.Router();
userRouter.patch(
  "/",
  tryCatchWrapper(auth),
  validateBody(subscriptionSchema),
  tryCatchWrapper(subscription),
);
userRouter.post("/signup", validateBody(signupSchema), tryCatchWrapper(signup));
userRouter.patch("/login", validateBody(loginSchema), tryCatchWrapper(login));
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));
userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
userRouter.patch(
  "/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(resizeAvatar),
  tryCatchWrapper(uploadAvatar),
);

module.exports = userRouter;
