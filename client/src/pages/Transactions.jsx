import React, { useMemo, useState } from "react";
import API from "../utils/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Plus } from "lucide-react";
import TransactionCard from "../components/TransactionCard";
import TransactionMessage from "../components/TransactionMessage";

const Transactions = ({ user, currencySign, transactions, setTransactions }) => {
  const [search, setSearch] = useState("");
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [title, setTitle] = useState("");
  const [firstAmount, setFirstAmount] = useState("");
  const [firstIsDebit, setFirstIsDebit] = useState(true);
  const [firstNote, setFirstNote] = useState("");
  const [secondAmount, setSecondAmount] = useState("");
  const [secondIsDebit, setSecondIsDebit] = useState(true);
  const [secondNote, setSecondNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, transactions]);

  const selectedHistory = useMemo(() => {
    return transactions.filter(
      (item) => item.title === selectedTitle
    );
  }, [selectedTitle, transactions]);

  const handleAddTransaction = async (title, isDebit, amount, note) => {
    try {
      const payload = { title, type: isDebit ? "Debit" : "Credit", amount: parseFloat(amount), note };
      const { data } = await API.post("/transactions/add", payload);
      setTransactions((prev) => [...prev, data.transaction]);
      toast.success("Transaction Added");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setTitle("")
    setFirstIsDebit("")
    setFirstAmount("")
    setFirstNote("")
    setSecondIsDebit("")
    setSecondAmount("")
    setSecondNote("")
  }

  const handleDeleteTransaction = async (id) => {
    try {
      console.log(id)
      const { data } = await API.delete(`/transactions/delete/${id}`);
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== id));
      toast.success("Transaction Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 xl:p-6">
      <div className="flex justify-between items-center mb-4 px-3 pt-3 sm:px-8 sm:pt-8 xl:px-6 xl:pt-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-800">
            Transactions
          </h2>
        </div>
        <Link to="/profile">
          <div className="w-12 h-12 rounded-full border-neutral-400">
            <img src={user?.avatar} alt="" className="w-full h-full rounded-full" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
        <div className={`bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4 overflow-hidden ${selectedTitle ? "hidden lg:flex" : "flex"} `}>
          <button onClick={() => setIsAdding(!isAdding)} className={` w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${isAdding ? "bg-red-500" : "bg-neutral-900"} cursor-pointer hover:opacity-90`}>
            <Plus className={`w-5 h-5 transition-all duration-300 ${isAdding ? "rotate-45" : ""}`} />
            {isAdding ? "Cancel" : "Add Transaction"}
          </button>
          {isAdding && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="first"
                      defaultChecked
                      onClick={() => setFirstIsDebit(true)}
                    />
                    Debit
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="first"
                      onClick={() => setFirstIsDebit(false)}
                    />
                    Credit
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={firstAmount}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\D/g, "");
                    if (value.length <= 5) {
                      setFirstAmount(e.target.value)
                    }
                  }}
                  className="flex-1 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <input
                type="text"
                placeholder="Add a note"
                value={firstNote}
                onChange={(e) => setFirstNote(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
              <button onClick={() => handleAddTransaction(title, firstIsDebit, firstAmount, firstNote)} className="w-full py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:slate-800 cursor-pointer hover:opacity-90">
                Add
              </button>
            </div>
          )}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col divide-y divide-neutral-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction._id} className="cursor-pointer">
                    <TransactionCard currencySign={currencySign} transaction={transaction} setSelectedTitle={setSelectedTitle} handleDeleteTransaction={handleDeleteTransaction} />
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-neutral-500">
                  No Transactions Found
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`lg:col-span-2 bg-white rounded-2xl shadow-md${selectedTitle ? "flex" : "hidden lg:flex"}flex-col overflow-hidden`}>
          {selectedTitle ? (
            <>
              <div className="p-4 sm:p-6 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedTitle(null)} className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl sm:text-3xl font-bold text-neutral-800 truncate">
                    {selectedTitle}
                  </h2>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  {selectedHistory.map((transaction) => (
                    <TransactionMessage
                      key={transaction._id}
                      currencySign={currencySign}
                      transaction={transaction}
                    />
                  ))}
                </div>
              </div>
              <div className="border-t border-neutral-200 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="second"
                        defaultChecked
                        onClick={() => setSecondIsDebit(true)}
                      />
                      Debit
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="second"
                        onClick={() => setSecondIsDebit(false)}
                      />
                      Credit
                    </label>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    value={secondAmount}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/\D/g, "");
                      if (value.length <= 5) {
                        setSecondAmount(e.target.value)
                      }
                    }}
                    className="flex-1 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    placeholder="Add a note"
                    value={secondNote}
                    onChange={(e) => setSecondNote(e.target.value)}
                    className="flex-1 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                  <button onClick={() => handleAddTransaction(selectedTitle, secondIsDebit, secondAmount, secondNote)} className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 whitespace-nowrap cursor-pointer">
                    Add
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex h-full items-center justify-center text-neutral-400 text-lg">
              Select a transaction to view history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;