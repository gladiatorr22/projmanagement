import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGO CONNECTED ✅");
        
    } catch (error) {
        console.error("mongodb connection error ❌",error)
        process.exit(1)
    }
}

export default connectDB