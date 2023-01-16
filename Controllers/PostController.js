import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import CommentModel from "../Models/commentModel.js";
import cloudinary from "../utils/cloudinary.js";

//create new post

export const createPost = async (req, res) => {
  console.log(req.file, "req.file latestt");
  const userId = req.params.id;
  console.log(userId, "userId in create post  ...");
  const image = req.file;
  const { desc } = req.body;
  if (!desc || !image) {
    res.status(404);
    throw new Error("Upload data not found.");
  }
  console.log(req.body, "ffff-req.body-fffff");

  const newPost = new PostModel(req.body);
  console.log(newPost, "newPooooooooooostttt");
  const postId = newPost._id;

  try {
    console.log("try ethi");
    // const result = await cloudimage
    const result = await cloudinary.uploader.upload(image?.path);

    (newPost.image = result.secure_url),
      (newPost.cloudinary_id = result.public_id);
    await newPost.save();
    const user = await UserModel.findById(userId);

    await user.updateOne({ $push: { posts: postId } });

    res.status(200).json("new post created");
  } catch (error) {

    console.log(error);
    res.status(500).json(error);
  }
};

//get a post

export const getPost = async (req, res) => {
  const Id = req.userId;


  try {
  
    const post = await PostModel.findById(Id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// comment a post

export const commentPost = async (req, res) => {
  const username = req.params.id;

  const { comment, postId } = req.body;

  if (!comment) {
    res.status(404);
    throw new Error("Upload data not found.");
  }
  const newComment = new CommentModel(req.body);
  newComment.username = username;

  try {
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
  }
};
//get all comments.....
export const allComments = async (req, res) => {
  console.log("get all comments.....");
  const posstId = req.params.id;
  const postId = mongoose.Types.ObjectId(posstId);

  try {
    const comment = await CommentModel.find({ postId: postId });

    const sortedComments = comment.sort(function (a, b) {
      return b.date - a.date;
    });
    res.status(200).json(sortedComments);
  } catch (error) {
    console.log(error);
  }
};

//delete comment

export const deleteComment = async (req, res) => {
console.log("delete comment");
  const commentIdd = req.params.id;
  const commentId = mongoose.Types.ObjectId(commentIdd);
  const { username } = req.body;

  try {
    const comment = await CommentModel.findById(commentId);
    if (comment.username === username) {
      await comment.deleteOne();
      res.status(200).json("comment deleted");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update  a  post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//delete a post

export const deletePost = async (req, res) => {

  const postId = req.params.id;

  const userId = req.userId;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(403).json("post not found");
    }
    if (post.userId != userId) {
     
      res.status(403).json({message:"Action forbidden",forbidden:true});
    } else {
      console.log("delete here");
      await post.deleteOne();
      res.status(200).json({message:"post deleted",delete:true});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like and dislike post

export const likePost = async (req, res) => {

  const postId = req.params.id;

  const userId = req.userId;


  try {
    const post = await PostModel.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("post disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//get timeline post

export const getTimelinePosts = async (req, res) => {
  const userId = req.userId;
  
  try {
   
    const currentUserPosts = await PostModel.find({ userId: userId }).populate(
      "userId"
    );
 


    const followingPosts = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingposts",
        },
      },
      {
        $project: {
          followingposts: 1,
          _id: 0,
        },
      },
    ]);

  
    res.status(200).json(
      currentUserPosts.concat(followingPosts[0].followingposts).sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (error) {

    res.status(500).json(error);
  }
};
