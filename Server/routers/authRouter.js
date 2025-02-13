const express = require("express");
const authenticateToken = require("../controllers/authorization.js");
const authRouter = express.Router();

// signup :
const {
  PostUserSignup,
  checkUsername,
  PostEmailVerification,
} = require("../controllers/signupController.js");

authRouter.route("/usernameCheck").post(checkUsername);
authRouter.route("/signup").post(PostUserSignup);
authRouter
  .route("/emailVerification")
  .post(authenticateToken, PostEmailVerification);

// login :
const {
  PostUserLogin,
  PostForgotPassword,
  PostResetPassword,
} = require("../controllers/loginController.js");

authRouter.route("/login").post(PostUserLogin);
authRouter.route("/forgotPassword").post(PostForgotPassword);
authRouter.route("/resetPassword").patch(authenticateToken, PostResetPassword);

module.exports = authRouter;
