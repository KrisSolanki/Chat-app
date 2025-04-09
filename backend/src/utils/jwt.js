import jwt from "jsonwebtoken"
export const generateToken = (id , res) => {
    const token = jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("token",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true, // prevent xss attack cross sight scripting attacks 
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}