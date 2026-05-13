import React, { useEffect, useState } from 'react'
import API from '../utils/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import BillCard from '../components/BillCard';

const RecurringBills = ({ user, currencySign, bills, setBills }) => {
  const [isAddingBill, setIsAddingBill] = useState(false);

  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const checkDueBills = () => {
    const today = new Date();
    setBills((prev) =>
      prev.map((bill) => {
        if (bill.status === "Paid") {
          return bill;
        }
        const dueDate = new Date(bill.dueDate);
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today) {
          return { ...bill, status: "Overdue" };
        }
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) {
          return { ...bill, status: "Due" };
        }
        return { ...bill, status: "Upcoming" };
      })
    );
  };

  useEffect(() => {
    checkDueBills();
  }, []);

  const handleAddBill = async () => {
    try {
      const payload = {
        name: billName,
        amount: parseFloat(billAmount),
        dueDate
      }
      const { data } = await API.post("/bills/add", payload);
      setBills((prev) => [...prev, data.bill]);
      toast.success("Bill Added");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setBillName("");
    setBillAmount("");
    setDueDate("");
    setIsAddingBill(false);
    checkDueBills();
  };

  const handlePayBill = async (id) => {
    try {
      const { data } = await API.put(`/bills/pay/${id}`);
      setBills((prev) => prev.map((bill) => bill._id === id ? data.bill : bill));
      toast.success("Bill Status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      const { data } = await API.delete(`/bills/delete/${id}`);
      setBills((prev) => prev.filter((bill) => bill._id !== id));
      toast.success("Bill Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-12 w-full p-4 xl:p-12 pb-20 xl:pb-12 h-full sm:h-screen overflow-y-scroll">
      <div className="flex justify-between items-center mb-4 px-3 pt-3 sm:px-8 sm:pt-8 xl:px-6 xl:pt-6">
        <div>
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">
            Recurring Bills
          </h2>
        </div>
        <Link to="/profile">
          <div className="w-12 h-12 rounded-full border-neutral-400">
            <img src={user?.avatar} alt="" className="w-full h-full rounded-full" />
          </div>
        </Link>
      </div>
      <div className="w-full">
        <button onClick={() => setIsAddingBill(!isAddingBill)} className={`w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold cursor-pointer ${isAddingBill ? "bg-red-500 text-white" : "bg-neutral-900 text-white hover:opacity-90"}`} >
          <Plus className={`w-5 h-5 transition-all duration-500 ${isAddingBill ? "rotate-45" : ""}`} />
          <span>{isAddingBill ? "Cancel" : "Add Bill"}</span>
        </button>
        {isAddingBill && (
          <div className="flex flex-col lg:flex-row gap-4 mt-4 p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm w-full">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-neutral-600">
                Bill Name
              </label>
              <input
                type="text"
                placeholder="e.g. House Rent"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-neutral-600">
                Bill Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-neutral-600">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleAddBill} className="w-full lg:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 cursor-pointer transition">
                Add
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="max-h-xl flex flex-col gap-3 w-full rounded-xl shadow-md p-4 border-t-[5px] border-green-600 bg-green-50 min-h-64">
          <h3 className="text-lg sm:text-xl font-bold text-green-700">
            Paid Bills
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-scroll">
            {bills.filter((bill) => bill.status === "Paid").length > 0 ? (
              bills.filter((bill) => bill.status === "Paid").map((bill) => (
                <BillCard key={bill._id} currencySign={currencySign} bill={bill} handlePayBill={handlePayBill} handleDeleteBill={handleDeleteBill} />
              ))
            ) : (
              <p className="text-sm sm:text-lg text-neutral-500 text-center py-10">
                No paid bills
              </p>
            )}
          </div>
        </div>
        <div className="max-h-xl flex flex-col gap-3 w-full rounded-xl shadow-md p-4 border-t-[5px] border-blue-500 bg-blue-50 min-h-64">
          <h3 className="text-lg sm:text-xl font-bold text-blue-700">
            Upcoming Bills
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-scroll">
            {bills.filter((bill) => bill.status === "Upcoming").length > 0 ? (
              bills.filter((bill) => bill.status === "Upcoming").map((bill) => (
                <BillCard key={bill._id} currencySign={currencySign} bill={bill} handlePayBill={handlePayBill} handleDeleteBill={handleDeleteBill} />
              ))
            ) : (
              <p className="text-sm sm:text-lg text-neutral-500 text-center py-10">
                No upcoming bills
              </p>
            )}
          </div>
        </div>
        <div className="max-h-xl flex flex-col gap-3 w-full rounded-xl shadow-md p-4 border-t-[5px] border-orange-500 bg-orange-50 min-h-64">
          <h3 className="text-lg sm:text-xl font-bold text-orange-700">
            Due Soon
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-scroll">
            {bills.filter((bill) => bill.status === "Due").length > 0 ? (
              bills.filter((bill) => bill.status === "Due").map((bill) => (
                <BillCard key={bill._id} currencySign={currencySign} bill={bill} handlePayBill={handlePayBill} handleDeleteBill={handleDeleteBill} />
              ))
            ) : (
              <p className="text-sm sm:text-lg text-neutral-500 text-center py-10">
                No due bills
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full rounded-xl shadow-md p-4 border-t-[5px] border-red-500 bg-red-50 min-h-64">
          <h3 className="text-lg sm:text-xl font-bold text-red-700">
            Overdue
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-scroll">
            {bills.filter((bill) => bill.status === "Overdue").length > 0 ? (
              bills.filter((bill) => bill.status === "Overdue").map((bill) => (
                <BillCard key={bill._id} currencySign={currencySign} bill={bill} handlePayBill={handlePayBill} handleDeleteBill={handleDeleteBill} />
              ))
            ) : (
              <p className="text-sm sm:text-lg text-neutral-500 text-center py-10">
                No due bills
              </p>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default RecurringBills