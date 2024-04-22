import mongoose from "mongoose";

const receiverSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    settled: {
        type: Boolean,
        default: false,
    }
});

const transactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receivers: [receiverSchema], // Array of subdocuments for receivers
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
