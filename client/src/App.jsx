import React, { useEffect, useState } from 'react'
import API from './utils/axios'
import { Routes, Route, Navigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Pots from './pages/Pots'
import RecurringBills from './pages/RecurringBills'
import ProfilePage from './pages/ProfilePage'
import NavigationFooter from './components/NavigationFooter'
import Sidebar from './components/Sidebar'
import Loading from './components/Loading'


function App() {
  const [user, setUser] = useState(null);
  const [currencySign, setCurrencySign] = useState(null);
  const [pots, setPots] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [budgets, setBudgets] = useState(null);
  const [bills, setBills] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const { data } = await API.get("/user/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    verifyUser();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, budgetsRes, potsRes, billsRes] = await Promise.all([
        API.get('/transactions/get'),
        API.get('/budgets/get'),
        API.get('/pots/get'),
        API.get('/bills/get')
      ]);
      setTransactions(transactionsRes.data.transactions);
      setBudgets(budgetsRes.data.budgets);
      setPots(potsRes.data.pots);
      setBills(billsRes.data.bills);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user?._id) {
      fetchData();
      switch (user.currency) {
        case "AED":
          setCurrencySign("د.إ");
          break;
        case "AUD":
          setCurrencySign("$");
          break;
        case "BDT":
          setCurrencySign("৳");
          break;
        case "BRL":
          setCurrencySign("$");
          break;
        case "CAD":
          setCurrencySign("$");
          break;
        case "CNY":
          setCurrencySign("¥");
          break;
        case "EUR":
          setCurrencySign("€");
          break;
        case "GBP":
          setCurrencySign("£");
          break;
        case "HKD":
          setCurrencySign("$");
          break;
        case "INR":
          setCurrencySign("₹");
          break;
        case "JPY":
          setCurrencySign("¥");
          break;
        case "KRW":
          setCurrencySign("₩");
          break;
        case "MXN":
          setCurrencySign("$");
          break;
        case "NPR":
          setCurrencySign("रू");
          break;
        case "NZD":
          setCurrencySign("$");
          break;
        case "RUB":
          setCurrencySign("₽");
          break;
        case "SAR":
          setCurrencySign("﷼");
          break;
        case "SGD":
          setCurrencySign("$");
          break;
        case "THB":
          setCurrencySign("฿");
          break;
        case "TRY":
          setCurrencySign("₺");
          break;
        case "USD":
          setCurrencySign("$");
          break;
        default:
          setCurrencySign("₹");
          break;
      }
    }
  }, [user?._id]);

  const handleDelete = async () => {
    try {
      await API.delete("/user/delete");

      localStorage.removeItem("token");

      toast.success("Account deleted");

      setUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading || (user && (!transactions || !budgets || !pots || !bills))) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="profile" element={user ? <ProfilePage user={user} setUser={setUser} currencySign={currencySign} handleLogout={handleLogout} handleDelete={handleDelete} /> : <Navigate to="/auth" />} />
        <Route path="/*" element={user ? (
          <div className="flex flex-col sm:flex-row bg-amber-50 overflow-hidden">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Overview user={user} setUser={setUser} currencySign={currencySign} pots={pots} transactions={transactions} budgets={budgets} bills={bills} />} />
              <Route path="/transactions" element={<Transactions user={user} currencySign={currencySign} transactions={transactions} setTransactions={setTransactions} />} />
              <Route path="/budgets" element={<Budgets user={user} currencySign={currencySign} budgets={budgets} setBudgets={setBudgets} />} />
              <Route path="/pots" element={<Pots user={user} currencySign={currencySign} pots={pots} setPots={setPots} />} />
              <Route path="/recurrings" element={<RecurringBills user={user} currencySign={currencySign} bills={bills} setBills={setBills} />} />
            </Routes>
            <NavigationFooter />
          </div>
        ) : (
          <Navigate to="/auth" />
        )} />
      </Routes>
    </>
  )
}

export default App
