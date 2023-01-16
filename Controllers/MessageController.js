import { compareSync } from "bcrypt";
import MessageModel from "../Models/MessageModel.js";

export const addMessage = async (req, res) => {
  console.log(req.body,"req-bodyyyyy")
  const { chatId, senderId, text } = req.body;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  console.log(message,"message add message")
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages=async(req,res)=>{
  console.log("getMessages")
    const {chatId}=req.params;
    try {
        const result=await MessageModel.find({chatId})
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error);
    }
}