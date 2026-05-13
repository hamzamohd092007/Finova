import express from 'express';
import Bill from '../models/Bill.js';
import auth from '../middlewares/auth.js';

const billRouter = express.Router();

billRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const bills = await Bill.find({ userId });
        res.status(200).json({ success: true, message: "Bills fetched successfully", bills });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

billRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name, amount, dueDate } = req.body;
        if (!name || !amount || !dueDate) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const newBill = await Bill.create({ name, amount, dueDate, userId });
        res.status(201).json({ success: true, message: "Bill added successfully", bill: newBill });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

billRouter.put("/pay/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Bill not found" });
        }
        const bill = await Bill.findById(id);
        if (!bill) {
            return res.status(400).json({ success: false, message: "Bill not found" });
        }
        if (bill.status === "Paid") {
            bill.status = "Upcoming"
        } else {
            bill.status = "Paid"
        }
        await bill.save();
        res.status(201).json({ success: true, message: "Bill payment done successfully", bill });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

billRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        const deletedBill = await Bill.findOneAndDelete({ _id: id, userId });
        if (!deletedBill) {
            return res.status(404).json({ success: false, message: "Bill not found" });
        }
        res.status(200).json({ success: true, message: "Bill deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default billRouter