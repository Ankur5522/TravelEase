import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;