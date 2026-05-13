import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpDown, Container, Home, ReceiptText, Wallet } from 'lucide-react'


const NavigationFooter = () => {

  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <div className={`flex xl:hidden px-2 pt-2 items-center justify-between fixed bottom-0 left-0 w-full bg-neutral-900`}>
      <Link to="/">
        <div className={`flex gap-4 ${currentPage === "/" ? "bg-white text-neutral-800 border-b-4 border-teal-700" : "text-neutral-400 hover:bg-neutral-800"} px-5 py-3 rounded-t-lg cursor-pointer transition`}>
          <Home className={`w-5 h-5 ${currentPage === "/" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
        </div>
      </Link>
      <Link to="/transactions">
        <div className={`flex gap-4 ${currentPage === "/transactions" ? "bg-white text-neutral-800 border-b-4 border-teal-700" : "text-neutral-400 hover:bg-neutral-800"} px-5 py-3 rounded-t-lg cursor-pointer transition`}>
          <ArrowUpDown className={`w-5 h-5 ${currentPage === "/transactions" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
        </div>
      </Link>
      <Link to="/budgets">
        <div className={`flex gap-4 ${currentPage === "/budgets" ? "bg-white text-neutral-800 border-b-4 border-teal-700" : "text-neutral-400 hover:bg-neutral-800"} px-5 py-3 rounded-t-lg cursor-pointer transition`}>
          <Wallet className={`w-5 h-5 ${currentPage === "/budgets" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
        </div>
      </Link>
      <Link to="/pots">
        <div className={`flex gap-4 ${currentPage === "/pots" ? "bg-white text-neutral-800 border-b-4 border-teal-700" : "text-neutral-400 hover:bg-neutral-800"} px-5 py-3 rounded-t-lg cursor-pointer transition`}>
          <Container className={`w-5 h-5 ${currentPage === "/pots" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
        </div>
      </Link>
      <Link to="/recurrings">
        <div className={`flex gap-4 ${currentPage === "/recurrings" ? "bg-white text-neutral-800 border-b-4 border-teal-700" : "text-neutral-400 hover:bg-neutral-800"} px-5 py-3 rounded-t-lg cursor-pointer transition`}>
          <ReceiptText className={`w-5 h-5 ${currentPage === "/recurrings" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
        </div>
      </Link>
    </div>
  )
}

export default NavigationFooter
