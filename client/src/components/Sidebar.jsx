import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpDown, Container, Home, ReceiptText, Wallet } from 'lucide-react'

const Sidebar = () => {

  const [minimizeMenu, setMinimizeMenu] = useState(false);

  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <div className={`hidden xl:flex flex-col ${minimizeMenu ? "px-1 py-2" : "w-sm"} h-screen gap-6 justify-between bg-neutral-900 rounded-r-xl`}>
      <div className={minimizeMenu ? "p-4" : "px-6 py-4"}>
        {!minimizeMenu && <h2 className="text-4xl text-white">finova</h2>}
        {minimizeMenu && <h2 className="text-4xl text-white">f</h2>}
      </div>
      <div className={`flex flex-col h-full ${minimizeMenu ? "pr-0" : "pr-6"}`}>
        <Link to="/">
          <div className={`flex gap-4 ${currentPage === "/" ? `bg-white text-neutral-800 ${minimizeMenu ? "" : "border-l-6 border-teal-700"}` : "text-neutral-400 hover:bg-neutral-800"} ${minimizeMenu ? "p-2 m-2 rounded-full" : "p-4 rounded-r-lg"} cursor-pointer transition`}>
            <Home className={`w-5 h-5 ${currentPage === "/" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
            {!minimizeMenu && <h4 className="text-md font-bold">Overview</h4>}
          </div>
        </Link>
        <Link to="/transactions">
          <div className={`flex gap-4 ${currentPage === "/transactions" ? `bg-white text-neutral-800 ${minimizeMenu ? "" : "border-l-6 border-teal-700"}` : "text-neutral-400 hover:bg-neutral-800"} ${minimizeMenu ? "p-2 m-2 rounded-full" : "p-4 rounded-r-lg"} cursor-pointer transition`}>
            <ArrowUpDown className={`w-5 h-5 ${currentPage === "/transactions" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
            {!minimizeMenu && <h4 className="text-md font-bold">Transactions</h4>}
          </div>
        </Link>
        <Link to="/budgets">
          <div className={`flex gap-4 ${currentPage === "/budgets" ? `bg-white text-neutral-800 ${minimizeMenu ? "" : "border-l-6 border-teal-700"}` : "text-neutral-400 hover:bg-neutral-800"} ${minimizeMenu ? "p-2 m-2 rounded-full" : "p-4 rounded-r-lg"} cursor-pointer transition`}>
            <Wallet className={`w-5 h-5 ${currentPage === "/budgets" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
            {!minimizeMenu && <h4 className="text-md font-bold">Budgets</h4>}
          </div>
        </Link>
        <Link to="/pots">
          <div className={`flex gap-4 ${currentPage === "/pots" ? `bg-white text-neutral-800 ${minimizeMenu ? "" : "border-l-6 border-teal-700"}` : "text-neutral-400 hover:bg-neutral-800"} ${minimizeMenu ? "p-2 m-2 rounded-full" : "p-4 rounded-r-lg"} cursor-pointer transition`}>
            <Container className={`w-5 h-5 ${currentPage === "/pots" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
            {!minimizeMenu && <h4 className="text-md font-bold">Pots</h4>}
          </div>
        </Link>
        <Link to="/recurrings">
          <div className={`flex gap-4 ${currentPage === "/recurrings" ? `bg-white text-neutral-800 ${minimizeMenu ? "" : "border-l-6 border-teal-700"}` : "text-neutral-400 hover:bg-neutral-800"} ${minimizeMenu ? "p-2 m-2 rounded-full" : "p-4 rounded-r-lg"} cursor-pointer transition`}>
            <ReceiptText className={`w-5 h-5 ${currentPage === "/recurrings" ? "text-teal-700" : "group-hover:text-teal-700"}`} />
            {!minimizeMenu && <h4 className="text-md font-bold">Recurring Bills</h4>}
          </div>
        </Link>
      </div>
      <div className={`py-8 ${minimizeMenu ? "pr-0" : "pr-6"}`}>
        <div onClick={() => setMinimizeMenu(!minimizeMenu)} className={`${minimizeMenu ? "p-2 mx-2 rounded-full" : "flex items-center px-6 py-4 gap-4 rounded-r-md"} group text-neutral-400 hover:bg-white hover:text-neutral-700 cursor-pointer`}>
          {minimizeMenu ? (
            <ArrowRight className="w-5 h-5 group-hover:text-teal-700" />
          ) : (
            <ArrowLeft className="w-5 h-5 group-hover:text-teal-700" />
          )}
          {!minimizeMenu && <h4 className="text-md font-bold">Minimize Menu</h4>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
