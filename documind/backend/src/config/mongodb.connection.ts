import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URI ;

const connectDB = async ()=>{
    try{
        await mongoose.connect(url as string)
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("Error connecting to MongoDB", error);
    }
}

export default connectDB;