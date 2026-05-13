import React, { useEffect, useState } from 'react'
import API from '../utils/axios'
import { ALL_COLORS } from '../assets/appData';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'
import { Pencil, Plus, Wallet } from 'lucide-react';
import BudgetCard from '../components/BudgetCard';

const Budgets = ({ user, currencySign, budgets, setBudgets }) => {
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [spendingId, setSpendingId] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");

  useEffect(() => {
    if (!editingId) return;
    setEditingBudget(
      budgets.find((budget) => budget._id === editingId)
    );
  }, [editingId]);

  const availableColors = ALL_COLORS.filter((color) => !budgets.some((budget) => budget.color === color));
  const randomColors = [...availableColors].sort(() => Math.random() - 0.5).slice(0, 8);

  const handleCancel = () => {
    setBudgetName("");
    setBudgetAmount("");
    setSelectedColor("#FF6B6B");
    setEditingId(null);
    setEditingBudget(null)
    setIsAddingBudget(false);
    setSpendingId(null);
    setSpentAmount("");
  }

  const handleAddBudget = async () => {
    try {
      const payload = {
        name: budgetName,
        budget: budgetAmount,
        color: selectedColor,
      };
      if (editingId) {
        const { data } = await API.put(`/budgets/edit/${editingId}`, payload);
        setBudgets((prev) => prev.map((budget) => budget._id === editingId ? data.budget : budget));
        toast.success("Budget updated");
      } else {
        const { data } = await API.post("/budgets/add", payload);
        setBudgets((prev) => [data.budget, ...prev]);
        toast.success("Budget created");
      }
      setBudgetName("");
      setBudgetAmount("");
      setSelectedColor("#FF6B6B");
      setEditingId(null);
      setEditingBudget(null)
      setIsAddingBudget(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  const handleSpendAmount = async () => {
    try {
      const { data } = await API.put(`/budgets/spend/${spendingId}`, { spentAmount: parseFloat(spentAmount) });
      setBudgets((prev) => prev.map((budget) => budget._id === spendingId ? data.budget : budget));
      toast.success("Amount spent successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
    setSpendingId(null);
    setSpentAmount("");
  };

  const handleDeleteBudget = async () => {
    try {
      const { data } = await API.delete(`/budgets/delete/${deletingId}`);
      setBudgets((prev) => prev.filter((budget) => budget._id !== deletingId));
      toast.success("Budget deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
    setDeletingId(null);
  };

  if (deletingId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-neutral-900">
            Delete Budget
          </h2>
          <p className="mt-3 text-neutral-600 leading-relaxed">
            Are you sure you want to delete this budget?
            This action cannot be undone.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={() => setDeletingId(null)} className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer">
              Cancel
            </button>
            <button onClick={handleDeleteBudget} className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:opacity-90 transition cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-12 w-full p-4 xl:p-12 pb-20 xl:pb-12 min-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 px-3 pt-3 sm:px-8 sm:pt-8 xl:px-6 xl:pt-6">
        <div>
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">
            Budgets
          </h2>
        </div>
        <Link to="/profile">
          <div className="w-12 h-12 rounded-full border-neutral-400">
            <img src={user?.avatar} alt="" className="w-full h-full rounded-full" />
          </div>
        </Link>
      </div>
      <div className="w-full flex flex-col gap-4">
        <button
          onClick={() => {
            if (isAddingBudget || editingId || spendingId) {
              handleCancel();
            } else {
              setIsAddingBudget(true);
            }
          }}
          className={`w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold cursor-pointer ${isAddingBudget || editingId || spendingId ? "bg-red-500 text-white" : "bg-neutral-900 text-white hover:opacity-90"}`}
        >
          <Plus className={`w-5 h-5 transition-all duration-500 ${isAddingBudget || editingId || spendingId ? "rotate-45" : ""}`} />
          <span>
            {isAddingBudget || editingId || spendingId ? "Cancel" : "Create Budget"}
          </span>
        </button>
        {(editingId || isAddingBudget) && (
          <div className="w-full bg-white border border-neutral-200 rounded-2xl shadow-sm p-3 sm:p-5">
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
              <div className="w-full xl:flex-1 xl:min-w-60">
                <label className="text-xs sm:text-sm font-medium text-neutral-600 mb-2 block">
                  Budget Name
                </label>
                <input
                  type="text"
                  placeholder={editingBudget ? editingBudget.name : "e.g. Shopping"}
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-1 sm:px-4 sm:py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="w-full xl:flex-1 xl:min-w-60">
                <label className="text-xs sm:text-sm font-medium text-neutral-600 mb-2 block">
                  Budget Amount
                </label>
                <input
                  type="number"
                  placeholder={editingBudget ? editingBudget.budget : "Enter budget"}
                  value={budgetAmount}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\D/g, "");
                    if (value.length <= 5) {
                      setBudgetAmount(value);
                    }
                  }}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-1 sm:px-4 sm:py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="w-full xl:w-auto xl:min-w-60">
                <label className="text-xs sm:text-sm font-medium text-neutral-600 mb-2 block">
                  Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {randomColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-105
                      ${selectedColor === color ? "border-black scale-110" : "border-transparent"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full xl:w-auto px-3 py-2 sm:px-6 sm:py-3">
                <button onClick={handleAddBudget} className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 transition cursor-pointer whitespace-nowrap">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
        {spendingId && (
          <div className="w-full sm:max-w-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <input
              type="number"
              placeholder="Enter amount spent"
              value={spentAmount}
              onChange={(e) => setSpentAmount(e.target.value)}
              className="flex-1 w-full border border-neutral-300 rounded-xl px-3 py-1 sm:px-4 sm:py-3 outline-none focus:ring-2 focus:ring-black"
            />
            <button onClick={handleSpendAmount} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 transition cursor-pointer whitespace-nowrap">
              Spend
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget._id}
            currencySign={currencySign}
            budget={budget}
            budgets={budgets}
            setEditingId={setEditingId}
            setSpendingId={setSpendingId}
            setDeletingId={setDeletingId}
          />
        ))}
      </div>
    </div >
  )
}

export default Budgets