const express = require("express");
const userRouter = express.Router();
const upload = require("../components/imageUploader.js");
const authenticateToken = require("../controllers/authorization.js");

// friend list:
const { getFriends, unFriend } = require("../controllers/friendController.js");
userRouter.route("/friends").get(authenticateToken, getFriends);
userRouter.route("/friends/:friendId").delete(authenticateToken, unFriend);

module.exports = userRouter;

// recommendations :
const {
  getRecommendations,
  sendRequest,
  searchUser,
} = require("../controllers/friendController.js");

userRouter.route("/recommendations").get(authenticateToken, getRecommendations);
userRouter.route("/search").get(authenticateToken, searchUser);
userRouter
  .route("/sendRequest/:friendId")
  .patch(authenticateToken, sendRequest);

// requests :
const {
  getRequests,
  handleRequest,
} = require("../controllers/requestController.js");

userRouter.route("/requests").get(authenticateToken, getRequests);
userRouter.route("/requests/:friendId").patch(authenticateToken, handleRequest);

// profile :

const {
  getProfile,
  updateProfile,
  deleteProfile,
  updateProfilePic,
} = require("../controllers/profileController.js");

userRouter
  .route("/profile")
  .get(authenticateToken, getProfile)
  .patch(authenticateToken, updateProfile)
  .delete(authenticateToken, deleteProfile);
userRouter
  .route("/profile/pic")
  .patch(authenticateToken, upload.single("image"), updateProfilePic);
