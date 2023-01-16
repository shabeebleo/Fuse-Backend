import ChatModel from "../Models/chatModel.js";

export const createChat = async (req, res) => {
  console.log(req.body,"req.bodyyyyy.................................creat chat")
  const senderId=req.body.senderId
  const receiverId=req.body.receiverId

  console.log(senderId,"senderId",receiverId,"recieverId")

 const chat = await ChatModel.findOne({
  members: { $all: [senderId, receiverId] },
});
if(!chat){
  if(senderId!=receiverId){
    const newChat = new ChatModel({
    
      members: [senderId, receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}


 
};

export const userChats = async (req, res) => {
  try {
    
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error);
  }
};
