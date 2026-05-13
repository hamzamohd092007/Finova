import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const TransactionCard = ({ currencySign, transaction, setSelectedTitle, handleDeleteTransaction }) => {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (currentPath === "/") {
      navigate("/transactions")
    }
    setSelectedTitle(transaction.title);
  }

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-3 hover:bg-neutral-100 rounded-xl transition">
      <div onClick={handleNavigate} className="w-full">
        <h2 className="text-sm sm:text-base lg:text-lg text-neutral-800 font-bold truncate">
          {transaction.title}
        </h2>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col text-right">
          <h2 className={`text-md ${transaction.type === "Credit" ? "text-teal-700" : "text-neutral-700"} font-bold`}>{`${transaction.type === "Credit" ? "+" : "-"}${currencySign}${(transaction.amount).toFixed(2)}`}</h2>
          <span className="text-neutral-500 text-[10px] sm:text-sm">{formatDate(transaction.createdAt)}</span>
        </div>
        {currentPath === "/transactions" && (
          <div className="p-2">
            <X onClick={(e) => handleDeleteTransaction(transaction._id)} className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionCard
