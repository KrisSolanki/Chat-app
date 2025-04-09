import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:[true,"First name is requeired"],
        trim:true
    },
    lastName:{
        type:String,
        require:[true,"Last name is requeired"],
        trim:true
    },
    email:{
        type:String,
        require:[true,"this field is mandatory"],
        unique:true
    },
    password:{
        type:String,
        require:[true,"this field is mandatory"],
        minLength: [6, "Password must contain atleast 6 characters"],
    },
    profilePic:{
        type:String,
        default:""
    }
},{
    timestamps:true
}
)

export const User = mongoose.model("User",userSchema)