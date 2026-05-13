import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Container, Indent } from 'lucide-react'
import TransactionCard from '../components/TransactionCard'
import BudgetChart from '../components/BudgetChart'
import toast from 'react-hot-toast'
import API from '../utils/axios'

const Overview = ({ user, setUser, currencySign, pots, transactions, budgets, bills }) => {
  const [currentBalance, setCurrentBalance] = useState("")
  const [income, setIncome] = useState("")
  const [expenses, setExpenses] = useState("");

  const getPotsSavings = () => {
    let totalSaved = 0;
    pots.map((pot) => {
      totalSaved += pot.saved;
    })
    return totalSaved
  }

  const getBudgetsData = () => {
    let totalSpent = 0;
    let totalBudget = 0;
    budgets.map((budget) => {
      totalSpent += budget.spent;
      totalBudget += budget.budget;
    })
    return { totalSpent, totalBudget }
  }

  const getBillsData = () => {
    let totalPaid = 0;
    let totalUpcoming = 0;
    let totalDue = 0;
    let totalOverdue = 0;
    bills.map((bill) => {
      if (bill.status === "Paid") {
        totalPaid += bill.amount;
      } else if (bill.status === "Upcoming") {
        totalUpcoming += bill.amount
      } else if (bill.status === "Due") {
        totalDue += bill.amount
      } else {
        totalOverdue += bill.amount
      }
    });
    return { totalPaid, totalUpcoming, totalDue, totalOverdue }
  }

  const handleContinue = async () => {
    try {
      const payload = { currentBalance: parseFloat(currentBalance), income: parseFloat(income), expenses: parseFloat(expenses) }
      const { data } = await API.put("/user/details", payload);
      setUser(data.user);
      toast.success("Details added");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setBillName("");
    setBillAmount("");
    setDueDate("");
    setIsAddingBill(false);
  };

  if (!user?.currentBalance || !user?.income || !user?.expenses) {
    return (
      <div className="min-h-screen w-full bg-amber-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-900">
              Setup Your Finances
            </h1>
            <p className="mt-2 text-neutral-500">
              Add your financial details to personalize your dashboard.
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">
                Current Balance
              </label>
              <input
                type="number"
                placeholder="Enter current balance"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">
                Monthly Income
              </label>
              <input
                type="number"
                placeholder="Enter monthly income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">
                Monthly Expenses
              </label>
              <input
                type="number"
                placeholder="Enter monthly expenses"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
              />
            </div>
            <button onClick={handleContinue} className="w-full rounded-2xl bg-neutral-900 py-3 font-semibold text-white transition hover:bg-black">
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const PotItem = ({ pot }) => {
    return (
      <div className="flex gap-2 sm:gap-4 h-full">
        <div className="w-0.5 sm:w-1 h-full rounded-sm" style={{ backgroundColor: pot.color }}></div>
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h4 className="text-sm sm:text-md text-neutral-500">{pot.name}</h4>
          <h2 className="text-xs sm:text-lg text-neutral-800 font-bold">{`${currencySign}${(pot.saved).toFixed(2)}`}</h2>
        </div>
      </div>
    )
  }

  const BudgetItem = ({ budget }) => {
    return (
      <div className="flex gap-2 sm:gap-4 h-full">
        <div className="w-0.5 sm:w-1 h-full rounded-sm" style={{ backgroundColor: budget.color }}></div>
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h4 className="text-sm sm:text-md text-neutral-500">{budget.name}</h4>
          <h2 className="text-xs sm:text-lg text-neutral-800 font-bold">{`${currencySign}${(budget.budget)?.toFixed(2)}`}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-12 w-full p-6 sm:p-12 h-full sm:h-screen overflow-y-scroll">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">Overview</h2>
        </div>
        <Link to="/profile">
          <div className="w-12 h-12 rounded-full border-neutral-400">
            <img src={user?.avatar} alt="" className="w-full h-full rounded-full" />
          </div>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:justify-between">
        <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 w-full bg-neutral-900 rounded-md shadow-md">
          <h4 className="text-md font-bold text-neutral-400">Currenct Balance</h4>
          <h2 className="text-2xl sm:text-4xl text-white font-bold">{`${currencySign}${(user?.currentBalance).toFixed(2)}`}</h2>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 w-full bg-white rounded-md shadow-md">
          <h4 className="text-md font-bold text-neutral-500">Income</h4>
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">{`${currencySign}${(user?.income).toFixed(2)}`}</h2>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 w-full bg-white rounded-md shadow-md">
          <h4 className="text-md font-bold text-neutral-500">Expenses</h4>
          <h2 className="text-2xl sm:text-4xl text-neutral-700 font-bold">{`${currencySign}${(user?.expenses).toFixed(2)}`}</h2>
        </div>
      </div>
      <div className="flex flex-col 2xl:flex-row gap-3 sm:gap-6">
        <div className="w-full flex flex-col gap-3 sm:gap-6">
          <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 bg-white shadow-md rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-md sm:text-xl font-bold text-neutral-800">Pots</h3>
              <Link to="/pots">
                <div className="flex gap-1 items-center text-neutral-500 hover:underline">
                  <span className="text-sm sm:text-lg font-bold">{pots.length > 0 ? "See Details" : "Add"}</span>
                  <ChevronRight className="w-4 h-4 fill-neutral-500" />
                </div>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {pots.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 sm:gap-6 w-full p-3 sm:p-6 bg-amber-50 shadow-sm rounded-lg">
                    <Container className="w-6 h-6 sm:w-8 sm:h-8 text-teal-700" />
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4 className="text-sm sm:text-lg text-neutral-500">Total saved</h4>
                      <h2 className="text-2xl sm:text-4xl text-neutral-800 font-bold">{`${currencySign}${(getPotsSavings()).toFixed(2)}`}</h2>
                    </div>
                  </div>
                  <div className="w-full gap-2 sm:gap-4 grid grid-cols-2 grid-rows-2">
                    {pots?.map((pot) => (
                      <div key={pot._id}>
                        <PotItem pot={pot} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-neutral-400">
                  No pots created
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-4 w-full p-3 sm:p-6 bg-white shadow-md rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-md sm:text-xl font-bold text-neutral-800">Transactions</h3>
              <Link to="/transactions">
                <div className="flex gap-1 items-center text-neutral-500 hover:underline">
                  <span className="text-sm sm:text-lg font-bold">{transactions.length > 0 ? "View All" : "Add"}</span>
                  <ChevronRight className="w-4 h-4 fill-neutral-500" />
                </div>
              </Link>
            </div>
            {transactions.length > 0 ? (<div className="flex flex-col gap-2">
              {transactions?.slice(0, 5).map((transaction) => (
                <div key={transaction._id}>
                  <TransactionCard currencySign={currencySign} transaction={transaction} />
                </div>
              ))}
            </div>
            ) : (
              <div className="text-neutral-400">
                No transactions created
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 sm:gap-6">
          <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 bg-white shadow-md rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-md sm:text-xl font-bold text-neutral-800">Budgets</h3>
              <Link to="/budgets">
                <div className="flex gap-1 items-center text-neutral-500 hover:underline">
                  <span className="text-sm sm:text-lg font-bold">{budgets.length > 0 ? "See Details" : "Add"}</span>
                  <ChevronRight className="w-4 h-4 fill-neutral-500" />
                </div>
              </Link>
            </div>
            {budgets.length > 0 ? (<div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <BudgetChart currencySign={currencySign} budgets={budgets} />
              <div className="grid grid-cols-2 grid-rows-4 gap-2 sm:gap-4">
                {budgets?.map((budget) => (
                  <div key={budget._id}>
                    <BudgetItem budget={budget} />
                  </div>
                ))}
              </div>
            </div>
            ) : (
              <div className="text-neutral-400">
                No budgets created
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 bg-white shadow-md rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-md sm:text-xl font-bold text-neutral-800">Recurring Bills</h3>
              <Link to="/recurrings">
                <div className="flex gap-1 items-center text-neutral-500 hover:underline">
                  <span className="text-sm sm:text-lg font-bold">{bills.length > 0 ? "See Details" : "Add"}</span>
                  <ChevronRight className="w-4 h-4 fill-neutral-500" />
                </div>
              </Link>
            </div>
            {bills.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-6 pb-1">
                <div className="flex items-center justify-between p-2 sm:p-7 bg-amber-50 border-l-4 border-green-700 rounded-lg">
                  <h3 className="text-md sm:text-xl text-neutral-500">Paid Bills</h3>
                  <h2 className="text-sm sm:text-lg text-neutral-700 font-bold">{`${(getBillsData().totalPaid).toFixed(2)}`}</h2>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-7 bg-amber-50 border-l-4 border-blue-700 rounded-lg">
                  <h3 className="text-md sm:text-xl text-neutral-500">Upcoming Bills</h3>
                  <h2 className="text-sm sm:text-lg text-neutral-700 font-bold">{`${(getBillsData().totalUpcoming).toFixed(2)}`}</h2>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-7 bg-amber-50 border-l-4 border-orange-700 rounded-lg">
                  <h3 className="text-md sm:text-xl text-neutral-500">Due Soon</h3>
                  <h2 className="text-sm sm:text-lg text-neutral-700 font-bold">{`${(getBillsData().totalDue).toFixed(2)}`}</h2>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-7 bg-amber-50 border-l-4 border-red-700 rounded-lg">
                  <h3 className="text-md sm:text-xl text-neutral-500">Overdue</h3>
                  <h2 className="text-sm sm:text-lg text-neutral-700 font-bold">{`${(getBillsData().totalOverdue).toFixed(2)}`}</h2>
                </div>
              </div>) : (
              <div className="text-neutral-400">
                No bills created
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default Overview
