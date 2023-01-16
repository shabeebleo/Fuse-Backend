import express from "express";
import { loginAdmin,getAllUsers,userStatusChange } from "../Controllers/AdminAuthController.js";
import  adminProtect  from "../middlewares/adminauthMiddleware.js";

const router = express.Router();

router.post("/login",loginAdmin)
router.get("/getUsers",adminProtect,getAllUsers)
router.put("/userStatusChange/:id",userStatusChange)

export default router 