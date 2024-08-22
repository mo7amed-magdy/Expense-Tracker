import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description:{
        type: String,
        required: true
    },
    paymentType:{
        type: String,
        required: true,
        enum:['card', 'cash']
    },
    category:{
        type: String,
        required: true,
        enum: ['saving', 'expense', 'investment']
    },
    amount:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        default:"unknown"
    },
    date:{
        type: Date,
        required: true,
        default: Date.now()
    }
},{timestamps:true})

const transactionModel = mongoose.model('transaction', schema)

export default transactionModel;