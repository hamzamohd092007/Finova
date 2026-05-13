import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    avatar: { type: String, default: "/defaultAvatar.svg" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    currency: { type: String, required: true },
    currentBalance: { type: Number },
    income: { type: Number },
    expenses: { type: Number }
}, { timestamps: true });

export default mongoose.model("User", userSchema);