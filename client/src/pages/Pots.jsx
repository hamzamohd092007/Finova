import React, { useEffect, useState } from 'react'
import API from '../utils/axios'
import { ALL_COLORS } from '../assets/appData';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'
import { Pencil, Plus } from 'lucide-react';
import PotCard from '../components/PotCard';

const Pots = ({ user, currencySign, pots, setPots }) => {
  const [isAddingPot, setIsAddingPot] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingPot, setEditingPot] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [savedAmount, setSavedAmount] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [potName, setPotName] = useState("");
  const [potAmount, setPotAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const isAlreadyTaken = (color) => {
    return pots.some((pot) => pot.color === color)
  }

  useEffect(() => {
    if (!editingId) return;
    setEditingPot(pots.find((pot) => pot._id === editingId));
  }, [editingId]);

  const availableColors = ALL_COLORS.filter((color) => !pots.some((pot) => pot.color === color));
  const randomColors = [...availableColors].sort(() => Math.random() - 0.5).slice(0, 8);

  const handleCancel = () => {
    setPotName("");
    setPotAmount("");
    setSelectedColor("");
    setEditingId(null);
    setEditingPot(null);
    setIsAddingPot(false);
    setSavingId(null);
    setSavedAmount("");
  }

  const handleAddPot = async () => {
    try {
      const payload = {
        name: potName,
        target: potAmount,
        color: selectedColor,
      };
      if (editingId) {
        const { data } = await API.put(`/pots/edit/${editingId}`, payload);
        setPots((prev) => prev.map((pot) => pot._id === editingId ? data.pot : pot))
        toast.success("Pot Added");
      } else {
        const { data } = await API.post("/pots/add", payload);
        setPots((prev) => [data.pot, ...prev]);
        toast.success("Pot Updated");
      }
      setPotName("");
      setPotAmount("");
      setSelectedColor("");
      setEditingId(null);
      setEditingPot(null);
      setIsAddingPot(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSaveAmount = async () => {
    try {
      const { data } = await API.put(`/pots/save/${savingId}`, { savedAmount: parseFloat(savedAmount) });
      setPots((prev) => prev.map((pot) => pot._id === savingId ? data.pot : pot))
      if (data.pot.target === data.pot.saved) {
        toast.success("Congratulations, you have completed your target");
      } else {
        toast.success("Congratulations on saving an amount");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setSavingId(null);
    setSavedAmount("");
  }

  const handleDeletePot = async () => {
    try {
      const { data } = await API.delete(`/pots/delete/${deletingId}`);
      setPots((prev) => prev.filter((pot) => pot._id !== deletingId));
      toast.success("Pot deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setDeletingId(null)
  }

  if (deletingId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200">  <h2 className="text-2xl font-bold text-neutral-900">
          Delete Pot
        </h2>
          <p className="mt-3 text-neutral-600 leading-relaxed">
            Are you sure you want to delete this pot?
            This action cannot be undone.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={() => setDeletingId(null)} className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition cursor-pointer" >
              Cancel
            </button>
            <button onClick={handleDeletePot} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90 transition cursor-pointer" >
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
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">Pots</h2>
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
            if (isAddingPot || editingId || savingId) {
              handleCancel();
            } else {
              setIsAddingPot(true);
            }
          }}
          className={`w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold cursor-pointer ${isAddingPot || editingId || savingId ? "bg-red-500 text-white" : "bg-neutral-900 text-white hover:opacity-90"}`}
        >
          <Plus
            className={`w-5 h-5 transition-all duration-500 ${isAddingPot || editingId || savingId ? "rotate-45" : ""
              }`}
          />
          <span>{isAddingPot || editingId || savingId ? "Cancel" : "Create Bill"}</span>
        </button>
        {(editingId || isAddingPot) && (
          <div className="w-full bg-white border border-neutral-200 rounded-2xl shadow-sm p-3 sm:p-5">
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
              <div className="w-full xl:flex-1 xl:min-w-60">
                <label className="text-xs sm:text-sm font-medium text-neutral-600 mb-2 block">
                  Pot Name
                </label>
                <input
                  type="text"
                  placeholder={editingPot ? editingPot.name : "e.g. New Laptop"}
                  value={potName}
                  onChange={(e) => setPotName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-1 sm:px-4 sm:py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="w-full xl:flex-1 xl:min-w-60">
                <label className="text-xs sm:text-sm font-medium text-neutral-600 mb-2 block">
                  Target Amount
                </label>
                <input
                  type="number"
                  placeholder={editingPot ? editingPot.target : "Enter your target"}
                  value={potAmount}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\D/g, "");
                    if (value.length <= 5) {
                      setPotAmount(value);
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
                    <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${selectedColor === color ? "border-black scale-110" : "border-transparent"}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="w-full xl:w-auto px-3 py-2 sm:px-6 sm:py-3">
                <button onClick={handleAddPot} className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 transition cursor-pointer whitespace-nowrap">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        {savingId && (
          <div className="w-full sm:max-w-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <input
              type="number"
              placeholder="Enter amount to save"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              className="flex-1 w-full border border-neutral-300 rounded-xl px-3 py-1 sm:px-4 sm:py-3 outline-none focus:ring-2 focus:ring-black"
            />
            <button onClick={handleSaveAmount} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 transition cursor-pointer whitespace-nowrap">
              Save
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pots.map((pot) => (
          <div key={pot._id}>
            <PotCard currencySign={currencySign} pots={pots} pot={pot} setEditingId={setEditingId} setSavingId={setSavingId} setDeletingId={setDeletingId} />
          </div>
        ))}
      </div>
    </div >
  )
}

export default Pots
