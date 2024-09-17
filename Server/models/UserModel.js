const mongoose = require("mongoose");
const groupNames = require("../components/groupNames");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username address Already exists"],
    required: true,
    minLength: 4,
    maxLength: 30,
    trim: true,
  },
  email: {
    address: {
      type: String,
      unique: [true, "Email address Already exists"],
      trim: true,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    verification_code: {
      type: Number,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  profile_pic: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  bio: {
    type: String,
    maxLength: 200,
  },
  interests: [String],
  groups: [{ type: String, enum: groupNames }],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
  requests: [
    {
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
});

module.exports = mongoose.model("UserModel", UserSchema);
