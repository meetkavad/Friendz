const userModel = require("../models/UserModel");
// const { friendRecommendations } = require("./recommendation.js");

const searchUser = async (req, res) => {
  const { user } = req.query;
  let filter = {};

  if (user && user !== "") {
    filter = { username: { $regex: user, $options: "i" } };
  }

  try {
    const users = await userModel
      .find(filter)
      .find({
        _id: { $ne: req.user.id },
      })
      .select("username profile_pic");

    // Map over the array of users to format the response for each user
    const formattedUsers = users.map((user) => {
      const id = user._id;
      const imageData = user.profile_pic.data;
      const contentType = user.profile_pic.contentType;
      const username = user.username;

      return {
        id,
        imageData,
        contentType,
        username,
      };
    });

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel
      .findById(userId)
      .populate("friends", "username profile_pic");

    // Map over the array of friends to format the response for each friend
    const formattedFriends = user.friends.map((friend) => {
      const id = friend._id;
      const imageData = friend.profile_pic.data;
      const contentType = friend.profile_pic.contentType;
      const username = friend.username;

      return {
        id,
        imageData,
        contentType,
        username,
      };
    });

    res.status(200).json({
      friends: formattedFriends,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const sendRequest = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const friend = await userModel.findById(friendId);
    if (!friend) {
      return res.status(404).json({
        msg: "Friend not found",
      });
    }
    friend.requests.push(userId);
    await friend.save();
    res.status(200).json({
      msg: "Request sent",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const unFriend = async (req, res) => {
  const userId = req.user.id;

  const { friendId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex === -1) {
      return res.status(404).json({
        msg: "Friend not found",
      });
    }
    user.friends.splice(friendIndex, 1);
    await user.save();
    res.status(200).json({
      msg: "Friend removed",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getRecommendations = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userModel
      .findById(userId)
      .populate("friends", "username profile_pic");
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const friends = user.friends.map((friend) => friend._id.toString());
    const users = await userModel.find({ _id: { $ne: req.user.id } });

    let recommendations = users.filter(
      (user) => !friends.includes(user._id.toString())
    );

    recommendations = recommendations.map((user) => {
      const id = user._id;
      const imageData = user.profile_pic.data;
      const contentType = user.profile_pic.contentType;
      const username = user.username;

      return {
        id,
        imageData,
        contentType,
        username,
      };
    });

    res.status(200).json({ recommendations: recommendations });

    // friendRecommendations(userId, 5).then((data) => {
    //   res.status(200).json({ recommendations: data });
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
module.exports = {
  searchUser,
  getFriends,
  sendRequest,
  unFriend,
  getRecommendations,
};
