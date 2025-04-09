import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { response } from "express";
import cloudinary from "../utils/cloudiary.js";

export const signup = async (req,res) => {
    try{
        const {firstName,lastName,email,password} = req.body;
        const user = await User.findOne({email})
        if(user) {
         console.log("if called")
         return res.status(400).json({message:`User with ${email} already exist`})
     }
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message:"All field are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 character"})
        }
       
       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(password,salt) 

       const newUser = await User.create({
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:hashPassword,
       })
       
       //Generate token
       if(newUser){
        generateToken(newUser._id,res)
       await newUser.save()
       res.status(201).json({message:"User registered successfully",user:newUser})
       }else{
        res.status(400).json({message:"Invalid user data"})
       }
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
export const login = async (req,res) => {
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"}) 
        }
        const comparePassword = await bcrypt.compare(password,user.password)
        console.log("Compare password",comparePassword)
        if(!comparePassword){
            return res.status(400).json({message:"Incorrect password"})
        }
        generateToken(user._id,res);
        return res.status(200).json({message:"login successfull",user})
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "login error" });
    }
}
export const logout = async (req,res) => {
    try{
        res.cookie("token","",{maxAge:0})
        res.status(200).json({message:"Logout successfully"})
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "logout error" });
    }
}

export const updateProfile = async (req,res) => {
    try{
        const {profilePic} = req.body;
        
        //check auth.protected.js as userid is requested from auth.protected.js
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"})
        }
       
        //it is uploading image to cloudinary 
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        //now it is updating image in the database 
        //secure_url is a field that cloudinary give back
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        
        return res.status(200).json(updatedUser)
    }catch(err){
        console.error("Error occured while updating profile picture",err)
        return res.status(500).json("Internal server error")
    }
}

export const checkAuth = async (req,res) =>{
    try {
        return res.status(200).json(req.user)
    } catch (err) {
        console.error("Error occured while checking authentication",err)
        res.status(400).json({message:"Internal server error"})
    }
}