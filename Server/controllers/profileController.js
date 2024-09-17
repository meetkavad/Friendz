const userModel = require("../models/UserModel");

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Format the profile picture data
    const profilePic = user.profile_pic
      ? {
          imageData: user.profile_pic.data,
          contentType: user.profile_pic.contentType,
        }
      : null;

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email.address,
        bio: user.bio,
        profilePic: profilePic,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  try {
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, data, {
        new: true,
      })
      .select("-password -email");

    if (!updatedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateProfilePic = async (req, res) => {
  const userId = req.user.id;

  try {
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;

      const imageData = {
        name: originalname,
        data: buffer,
        contentType: mimetype,
      };

      const updatedUser = await userModel
        .findByIdAndUpdate(userId, { profile_pic: imageData }, { new: true })
        .select("-password -email");

      if (!updatedUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "Profile picture updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(400).json({
        message: "No file uploaded",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { updateProfilePic, getProfile, updateProfile, deleteProfile };
