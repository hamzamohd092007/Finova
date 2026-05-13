import mongoose from "mongoose";

const potSchema = new mongoose.Schema({
    name: { type: String, required: true },
    saved: { type: Number, default: 0},
    target: { type: Number, required: true},
    color: { type: String, required: true},
    userId: { type: String, required: true}
}, { timestamps: true });

export default mongoose.model("Pot", potSchema);