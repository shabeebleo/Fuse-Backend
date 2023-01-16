import express from 'express'
import { createChat,userChats,findChat } from '../Controllers/ChatController.js'
import protect from "../middlewares/authMiddleware.js";
const router=express.Router()

router.post("/",protect,createChat)
router .get("/:userId",protect,userChats)
router.get("/find/:firstId/:secondId",protect,findChat)

export default router
