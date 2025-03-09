import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoutes= async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized: No token"});
        }
        const isdecoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!isdecoded){
            return res.status(401).json({message:"Unauthorized: Invalid Token"});
        }
        const user=await User.findById(isdecoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"No user found"});
        }
        req.user=user;
    }
    catch(e){
        console.log("Error in Protect Route", e.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
    next();
};