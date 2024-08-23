import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String
    },
    gender:{
        type: String,
        required: true,
        enum: ["male", "female"]
    }
},{timestamps:true})


const userModel = mongoose.model("user", schema);

export default userModel;