import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {getReceiverSocketId,io} from "../lib/socket.js";

export const getuserforSidebar=async (req,res)=>{
    try{
        const loggedinuser=req.user._id;
        const filteredusers=await User.find({_id: {$ne:loggedinuser}}).select("-password");
        res.status(200).json(filteredusers);
    }
    catch(error){
        console.log("Error in Sidebar Message Controller", error.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};

export const getMessages=async(req,res)=>{
    try{
        const otherId=req.params._id;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:otherId},
                {senderId:otherId,receiverId:myId},
            ]
        });
        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages Message Controller", error.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};

export const sendMessages = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      let imageUrl;
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };