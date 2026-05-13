import React from 'react'
import { AlertTriangle, CalendarDays, CircleCheck, Clock3, X } from 'lucide-react'

const BillCard = ({ currencySign, bill, handlePayBill, handleDeleteBill }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`flex items-center justify-between ${bill.status === "Paid" ? "text-green-700 hover:bg-green-100" : (bill.status === "Upcoming" ? "text-blue-700 hover:bg-blue-100" : (bill.status === "Due" ? "text-orange-700 hover:bg-orange-100" : "text-red-600 hover:bg-red-100"))} p-2 sm:p-4 rounded-lg cursor-pointer`}>
      <div>
        <h2 className="text-md sm:text-xl font-bold">{bill.name}</h2>
      </div>
      <div className="flex items-center gap-2">
        <h2 className={`text-md font-bold ${bill.status === "Paid" ? "text-green-600" : (bill.status === "Upcoming" ? "text-blue-600" : (bill.status === "Due" ? "text-orange-600" : "text-red-600"))}`}>{`${currencySign}${(bill.amount).toFixed(2)}`}</h2>
        <p className={`text-sm ${bill.status === "Paid" ? "text-green-600" : (bill.status === "Upcoming" ? "text-blue-600" : (bill.status === "Due" ? "text-orange-600" : "text-red-600"))}`}>
          {formatDate(bill.dueDate)}
        </p>
        <div>
          {bill.status === "Paid" ? (
            <CircleCheck className="w-5 h-5 text-green-500" />
          ) : (bill.status === "Upcoming" ? (
            <CalendarDays className="w-5 h-5 text-blue-500" />
          ) : (bill.status === "Due" ? (
            <Clock3 className="w-5 h-5 text-orange-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )))}
        </div>
        <button onClick={() => handlePayBill(bill._id)} className={`px-2 py-1 ${bill.status === "Paid" ? "bg-green-100 hover:bg-green-200 text-green-400" : (bill.status === "Upcoming" ? "bg-blue-100 hover:bg-blue-200 text-blue-400" : (bill.status === "Due" ? "bg-orange-100 hover:bg-orange-200 text-orange-400" : "bg-red-100 hover:bg-red-200 text-red-400"))} rounded-lg cursor-pointer`}>
          {bill.status === "Paid" ? "Mark unpaid" : "Pay now"}
        </button>
        <button onClick={() => handleDeleteBill(bill._id)} className={`p-1 ${bill.status === "Paid" ? "hover:bg-green-200" : (bill.status === "Upcoming" ? "hover:bg-blue-200" : (bill.status === "Due" ? "hover:bg-orange-200" : "hover:bg-red-200"))} rounded-full cursor-pointer`}>
          <X className={`w-5 h-5 ${bill.status === "Paid" ? "text-green-400" : (bill.status === "Upcoming" ? "text-blue-400" : (bill.status === "Due" ? "text-orange-400" : "text-red-400"))}`} />
        </button>
      </div>
    </div>
  )
}

export default BillCard
