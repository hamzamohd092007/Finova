import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true},
    dueDate: { type: String, required: true},
    status: { type: String, default: "Upcoming"},
    userId: { type: String, required: true}
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);