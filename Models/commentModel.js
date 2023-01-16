import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
     type: String,
     trim: true,
     required: true
    },
    postId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    date: {
     type: Date,
     default: Date.now
     },
     username:{
        type: String,       
     }
    })

    const CommentModel = mongoose.model("Comment", commentSchema);
    export default CommentModel;