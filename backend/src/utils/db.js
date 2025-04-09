import mongoose from "mongoose";

export const db = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // console.log(`MONGODB Connected:${conn.connection.host}`);
        console.log(`MONGODB connected successfully`);
        
    }catch(err){
        console.error("Error occured while connecting database:",err)
        process.exit(1)
    }
}