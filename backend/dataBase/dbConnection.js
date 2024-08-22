import mongoose from "mongoose";

export const dbConnection =()=>{
    mongoose.connect(process.env.MONGODB).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
    console.log("database error",err);
    })

}