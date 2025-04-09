import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const protectedRoute = async (req,res,next) => {
    try{
        // console.log(req.cookies)
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"})
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid token"})
        }
        
        const user = await User.findById(decoded.id).select("-password");
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.user = user;
        next()
    }catch(err){
        console.error("An error occured while requesting this process",err)
        return res.status(500).json({message:"Internal server error"});
    }
}