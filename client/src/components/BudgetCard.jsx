import React from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash, Wallet } from 'lucide-react'

const BudgetCard = ({ currencySign, budget, setEditingId, setSpendingId, setDeletingId}) => {

  const remaining = budget.budget - budget.spent;

  const percentage = (budget.spent / budget.budget) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 bg-white hover:bg-neutral-100 hover:-translate-y-1 shadow-md rounded-2xl border-l-4 cursor-pointer transition-all duration-300" style={{ borderLeftColor: budget.color }}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
          {budget.name}
        </h2>
        <div className="flex items-center gap-2 w-24 sm:w-48">
          <div className="w-full h-3 rounded-full bg-neutral-300 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: budget.color }} />
          </div>
          <p className="text-xs text-neutral-400">
            {percentage.toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1 sm:px-2">
        <h3 className="text-base sm:text-lg font-medium text-neutral-700">
          {currencySign}{budget.spent.toFixed(2)}
        </h3>
        <h3 className="text-sm sm:text-base text-neutral-500">
          spent of {currencySign}{budget.budget.toFixed(2)}
        </h3>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSpendingId(budget._id) } className="group p-2 rounded-md bg-blue-500/20 hover:bg-blue-300 transition cursor-pointer">
            <Wallet className="w-3 h-3 sm:w-5 sm:h-5 text-blue-500 group-hover:text-blue-700" />
          </button>
          <button onClick={() => setEditingId(budget._id) } className="group p-2 rounded-md bg-green-500/20 hover:bg-green-300 transition cursor-pointer">
            <Pencil className="w-3 h-3 sm:w-5 sm:h-5 text-green-500 group-hover:text-green-700" />
          </button>
          <button onClick={() => setDeletingId(budget._id)} className="group p-2 rounded-md bg-red-500/20 hover:bg-red-300 transition cursor-pointer">
            <Trash className="w-3 h-3 sm:w-5 sm:h-5 text-red-500 group-hover:text-red-700" />
          </button>
        </div>
        {budget.spent >= budget.budget ? (
          <h2 className="text-sm sm:text-lg font-medium text-red-500 text-right">
            Budget exceeded
          </h2>
        ) : (
          <h2 className="text-sm sm:text-lg font-medium text-neutral-600 text-right">
            {currencySign}{remaining.toFixed(2)} left
          </h2>
        )}
      </div>
    </div >
  )
}

export default BudgetCard