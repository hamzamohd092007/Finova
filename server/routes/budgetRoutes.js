import express from 'express';
import Budget from '../models/Budget.js';
import auth from '../middlewares/auth.js';

const budgetRouter = express.Router();

budgetRouter.get("/get", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Budgets fetched successfully", budgets });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

budgetRouter.post("/add", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name, budget, color } = req.body;
        if (!name || !budget || !color) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const newBudget = await Budget.create({ name, budget, color, userId });
        res.status(201).json({ success: true, message: "Budget added successfully", budget: newBudget });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

budgetRouter.put("/edit/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { id } = req.params;
        const { name, budget, color } = req.body;
        if (!name || !budget || !color) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: id, userId },
            { name, budget, color },
            { new: true }
        );
        if (!updatedBudget) {
            return res.status(404).json({ success: false, message: "Budget not found" });
        }
        return res.status(200).json({ success: true, message: "Budget updated successfully", budget: updatedBudget });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

budgetRouter.put("/spend/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { spentAmount } = req.body;
        if (!spentAmount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Budget not found" });
        }
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(400).json({ success: false, message: "Budget not found" });
        }
        const updatedSpentAmount = budget.spent + spentAmount;
        if (updatedSpentAmount > budget.budget) {
            return res.status(400).json({ success: false, message: `Cannot spend more than your budget ${budget.budget}` });
        }
        budget.spent = updatedSpentAmount;
        await budget.save();
        res.status(201).json({ success: true, message: "Amount spent successfully", budget });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

budgetRouter.delete("/delete/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const id = req.params.id;
        const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId });
        if (!deletedBudget) {
            return res.status(404).json({ success: false, message: "Budget not found" });
        }
        res.status(200).json({ success: true, message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default budgetRouter