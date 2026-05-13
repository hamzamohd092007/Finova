import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true},
    note: { type: String },
    userId: { type: String, required: true}
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);