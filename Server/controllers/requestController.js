const userModel = require("../models/UserModel");

const getRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    // fetch all requests through ids:

    const requests = await userModel
      .find({
        _id: { $in: user.requests },
      })
      .select("username profile_pic");

    // Map over the array of requests to format the response for each request
    const formattedRequests = requests.map((request) => {
      const id = request._id;
      const imageData = request.profile_pic.data;
      const contentType = request.profile_pic.contentType;
      const username = request.username;

      return {
        id,
        imageData,
        contentType,
        username,
      };
    });

    res.status(200).json({
      requests: formattedRequests,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const handleRequest = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;
  const { action } = req.query;

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

    if (action === "accept") {
      user.friends.push(friendId);
      friend.friends.push(userId);
      user.requests = user.requests.filter(
        (request) => request._id.toString() !== friendId
      );
      await user.save();
      await friend.save();
      return res.status(200).json({
        msg: "Request accepted",
      });
    } else if (action === "reject") {
      user.requests = user.requests.filter(
        (request) => request._id.toString() !== friendId
      );
      await user.save();
      return res.status(200).json({
        msg: "Request rejected",
      });
    } else {
      return res.status(400).json({
        msg: "Invalid action",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  getRequests,
  handleRequest,
};
