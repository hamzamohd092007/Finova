import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const transactionRouter = express.Router();

transactionRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Transactions fetched successfully", transactions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

transactionRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { title, type, amount, note } = req.body;
        if (!title || !type || !amount || !note) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const newTransaction = await Transaction.create({ title, type, amount, note, userId });
        res.status(201).json({ success: true, message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

transactionRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId });
        if (!deletedTransaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default transactionRouter