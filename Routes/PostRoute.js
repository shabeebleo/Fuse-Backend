import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
  commentPost,
  allComments,
  deleteComment
} from "../Controllers/PostController.js";
import protect from "../middlewares/authMiddleware.js";
import { uploads } from "../utils/multer.js";
const router = express.Router();

router.post("/createPost/:id", uploads.single("image"), createPost);
router.get("/", protect, getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);
router.get("/timeline", protect, getTimelinePosts);
router.post("/:id/commentPost",commentPost)
router.get("/:id/allComments",protect,allComments)
router.post("/delete/:id",protect,deleteComment)
export default router;

//uploads.single("myImage"),
