import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true},
    spent: { type: Number, default: 0},
    color: { type: String, required: true},
    userId: { type: String, required: true}
}, { timestamps: true });

export default mongoose.model("Budget", budgetSchema);