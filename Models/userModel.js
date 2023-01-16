import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      requires: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    followStatus: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Posts",
    },
    isBlocked: { type: Boolean, default: false },
    profilePicture: String,
    profileCloudinary_id: String,
    coverCloudinary_id: String,
    coverPicture: String,
    about: String,
    livesin: String,
    worksat: String,
    relationship: String,
    followers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    following: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
