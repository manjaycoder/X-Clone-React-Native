import mongoose from "mongoose"
import {ENV} from "./env.js"


export const connectDB=async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("Connect tp DB SUCCESSFULLY 🏡")
    } catch (error) {
        console.log("Error connecting to database")
        process.exit(1)
    }
}
