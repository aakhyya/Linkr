import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup= async (req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All fields are mandatory"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be of atleast 6 characters."});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists!"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            fullName,
            email,
            password: hashedPassword
        });
        if (newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            });
        }
        else{
            res.status(400).json({message:"Invalid User data!"});
        }
    }
    catch(error){
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};
export const login= async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const iscorrectPass= await bcrypt.compare(password,user.password);
        if(!iscorrectPass){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        });

    }
    catch(err){
        console.log("Error in Login Controller", err.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{expires: new Date(0)});
        res.status(200).json({message:"Logged Out Successfully!"});
    }
    catch(e){
        console.log("Error in Logout Controller", e.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};
export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        if (!profilePic){
            return res.status(400).json({message:"No Profile pic provided"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );
        res.status(200).json(updateUser);
    }
    catch(err){
        console.log("Error in Update Profile Controller", err.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};

export const authCheck=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in Auth Check Contoller", err.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
};