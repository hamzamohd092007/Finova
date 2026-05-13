import React from 'react'

const TransactionMessage = ({ currencySign, transaction }) => {
  const isCredit = transaction.type === "Credit";
  return (
    <div key={transaction._id} className={`flex ${isCredit ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`max-w-[90%] sm:max-w-[82%] rounded-3xl px-5 py-4 shadow-xl transition-all duration-300 hover:scale-[1.02] ${isCredit ? "bg-linear-to-br from-emerald-400 to-green-600 text-white rounded-bl-md" : "bg-linear-to-br from-zinc-700 to-black text-white rounded-br-md"}`}>
        <div className="flex items-start justify-between gap-5">
          <h3 className="font-semibold text-[16px] wrap-break-word">
            {transaction.title}
          </h3>
          <span className="font-bold text-[17px] whitespace-nowrap">
            {`${currencySign}${(((transaction.amount).toFixed(2)))}`}
          </span>
        </div>
        {transaction.note && (
          <p className="text-sm opacity-90 mt-2 leading-relaxed wrap-break-word">
            {transaction.note}
          </p>
        )}
        <p className="text-xs opacity-70 mt-3 text-right">
          {new Date(transaction.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default TransactionMessage
