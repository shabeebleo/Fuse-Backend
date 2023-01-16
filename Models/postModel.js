import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    desc: String,
    image: { type: String, required: true },
    likes: [],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    liked: { type: Boolean },
    cloudinary_id: { type: String },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Posts", PostSchema);
export default PostModel;
