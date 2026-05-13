import express from 'express';
import Pot from '../models/Pot.js';
import auth from '../middlewares/auth.js';

const potRouter = express.Router();

potRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const pots = await Pot.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Pots fetched successfully", pots });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

potRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name, target, color } = req.body;
        if (!name || !target || !color) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const newPot = await Pot.create({ name, target, color, userId });
        res.status(201).json({ success: true, message: "Pot added successfully", pot: newPot });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

potRouter.put("/edit/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { id } = req.params;
        const { name, target, color } = req.body;
        if (!name || !target || !color) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const updatedPot = await Pot.findOneAndUpdate(
            { _id: id, userId },
            { name, target, color },
            { new: true }
        );
        if (!updatedPot) {
            return res.status(404).json({ success: false, message: "Pot not found" });
        }
        return res.status(200).json({ success: true, message: "Pot updated successfully", pot: updatedPot });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

potRouter.put("/save/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Pot not found" });
        }
        const { savedAmount } = req.body;
        if (!savedAmount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }
        const pot = await Pot.findById(id);
        if (!pot) {
            return res.status(400).json({ success: false, message: "Pot not found" });
        }
        const updatedSavedAmount = pot.saved + savedAmount;
        if (updatedSavedAmount > pot.target) {
            return res.status(400).json({ success: false, message: `Cannot save more than target amount (${pot.target})` });
        }
        pot.saved = updatedSavedAmount;
        await pot.save();
        res.status(201).json({ success: true, message: "Amount saved successfully", pot });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

potRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        const deletedPot = await Pot.findOneAndDelete({ _id: id, userId });
        if (!deletedPot) {
            return res.status(404).json({ success: false, message: "Pot not found" });
        }
        res.status(200).json({ success: true, message: "Pot deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default potRouter