import express from "express";
import { getUser ,getAnyUser} from "../Controllers/UserController.js";
import { passwordChange } from "../Controllers/UserController.js";
import { updateUser } from "../Controllers/UserController.js";
import { deleteUser ,getSearchUsers} from "../Controllers/UserController.js";
import { followUnFollowUser } from "../Controllers/UserController.js";
import { getAllUsers } from "../Controllers/UserController.js";
import { profileData,getFollowers } from "../Controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";
import { uploads } from "../utils/multer.js";
const router = express.Router();

router.get("/", protect, getUser);
router.get("/getAllUsers", getAllUsers);
router.post(
  "/:id",protect,
  uploads.fields([
    {
      name: "profile",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    }
  ]),
  updateUser
);
router.get("/profiledata/:id",protect,profileData)
router.get("/:id",protect,getAnyUser)
router.put("/:id", protect, passwordChange);
router.delete("/:id", protect, deleteUser);
router.put("/:id/follow", protect, followUnFollowUser);
router.put("/:id/unfollow", protect, followUnFollowUser);
router.get("/followers/:id", protect, getFollowers);
router.get("/searchUser/:id",getSearchUsers)
export default router;
