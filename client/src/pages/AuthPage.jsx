import React, { useState } from 'react'
import API from '../utils/axios';
import { getPasswordStrength, normalizeEmail, normalizeName, validateAuth, formatName } from "../utils/validators";
import { defaultTransactions, defaultBudgets, defaultPots, defaultBills } from '../assets/appData';
import toast from 'react-hot-toast'
import { Eye, EyeOff, Upload } from 'lucide-react';


const AuthPage = ({ setUser }) => {
  const currencies = ["AED", "AUD", "BDT", "BRL", "CAD", "CNY", "EUR", "GBP", "HKD", "INR", "JPY", "KRW", "MXN", "NPR", "NZD", "RUB", "SAR", "SGD", "THB", "TRY", "USD"];
  const [currentState, setCurrentState] = useState("Sign In");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSelectingCurrency, setIsSelectingCurrency] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = getPasswordStrength(password);
    
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; if (file) { setAvatar(URL.createObjectURL(file)); setAvatarFile(file); }
  };

  const filteredCurrencies = currencies.filter((option) =>
    option.includes(currency)
  );

  const { isSubmitValid } = validateAuth({ type: currentState === "Sign Up" ? "signup" : "signin", fullName, email, password, confirmPassword });

  const processingDefaultData = async () => {
    try {
      await Promise.all([
        ...defaultTransactions.map((transaction) => API.post("/transactions/add", transaction)),
        ...defaultBudgets.map((budget) => API.post("/budgets/add", budget)),
        ...defaultPots.map((pot) => API.post("/pots/add", pot)),
        ...defaultBills.map((bill) => API.post("/bills/add", bill)),
      ]);
    } catch (error) {
      console.error("Error processing default data:", error);
    }
  };

  const handleSignUp = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signup", fullName, email, password, confirmPassword });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    const formData = new FormData();
    formData.append("fullName", formatted.fullName);
    formData.append("email", formatted.email);
    formData.append("currency", currency);
    formData.append("password", password);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const { data } = await API.post("/user/signup", formData);
      localStorage.setItem("token", data.token);
      await processingDefaultData();
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setAvatar(null);
    setAvatarFile(null);
    setFullName("");
    setEmail("");
    setCurrency("");
    setPassword("");
    setConfirmPassword("");
  }

  const handleSignIn = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signin", email, password });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    try {
      const { data } = await API.post("/user/signin", { email: formatted.email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-neutral-200 shadow-2xl">
        <div className="hidden md:flex flex-col justify-between bg-neutral-900 p-10 text-white gap-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              ExpenseTracker
            </h1>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              Track expenses, manage budgets and understand your spending habits with a clean and modern finance dashboard.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">
                Smart Expense Tracking
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Monitor your daily spending with beautifully organized categories
                and real-time insights.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">
                Budget Management
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Set monthly budgets and keep your finances under control with
                instant spending analysis.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">
                Secure & Private
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Your financial data stays encrypted, protected, and accessible only
                to you.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 md:p-10">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-neutral-900">
                {currentState === "Sign In" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-neutral-500 mt-2">
                {currentState === "Sign In" ? "Login to continue managing your finances." : "Start tracking your expenses today."}
              </p>
            </div>
            <div className="space-y-4">
              {currentState === "Sign Up" && (
                <div>
                  <label className="text-sm font-medium text-neutral-700 block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Mohd Hamza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={(e) => setFullName(formatName(e.target.value))}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
                  />
                </div>
              )}
              {currentState === "Sign Up" && (
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    {avatar ? (
                      <img src={avatar} className="w-16 h-16 rounded-full object-cover border border-neutral-300" />
                    ) : (
                      <div className="w-16 h-16 rounded-full border border-dashed border-neutral-400 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}
                  </label>
                  <div>
                    <p className="font-medium text-neutral-800">
                      Upload Avatar
                    </p>
                    <p className="text-sm text-neutral-500">
                      PNG, JPG supported
                    </p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
                />
              </div>
              {currentState === "Sign Up" && (
                <div className="relative w-full">
                  <label className="text-sm font-medium text-neutral-700 block mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    placeholder={isSelectingCurrency ? "Search your currency" : "Select currency"}
                    value={currency}
                    onFocus={() => setIsSelectingCurrency(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsSelectingCurrency(false);
                      }, 200);
                    }}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm sm:text-[14px] outline-none focus:border-neutral-900 transition placeholder:text-neutral-400"
                  />
                  {isSelectingCurrency && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-full overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xl">
                      <div className="max-h-44 overflow-y-auto sm:max-h-52">
                        {filteredCurrencies.length > 0 ? (
                          filteredCurrencies.map((option) => (
                            <div key={option} onMouseDown={() => setCurrency(option)} className="cursor-pointer px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-900 hover:text-white">
                              {option}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-neutral-400">
                            No currency found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500">
                    {!showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </span>
                </div>
                {currentState === "Sign Up" && password && (
                  <p className={`text-sm mt-2 ${strength === "Weak" ? "text-red-500" : strength === "Medium" ? "text-yellow-500" : "text-green-600"}`}>
                    Strength: {strength}
                  </p>
                )}
              </div>
              {currentState === "Sign Up" && (
                <div>
                  <label className="text-sm font-medium text-neutral-700 block mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900 transition"
                    />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500">
                      {!showConfirmPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
              )}
              <button disabled={!isSubmitValid} onClick={currentState === "Sign Up" ? handleSignUp : handleSignIn} className={`w-full py-3 rounded-xl font-semibold transition ${isSubmitValid ? "bg-neutral-900 text-white hover:bg-black cursor-pointer" : "bg-neutral-300 text-neutral-500 cursor-not-allowed"}`}>
                {currentState === "Sign Up" ? "Create Account" : "Login"}
              </button>
              <p className="text-center text-sm text-neutral-500">
                {currentState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
                <span onClick={() => setCurrentState(currentState === "Sign Up" ? "Sign In" : "Sign Up")} className="ml-1 text-neutral-900 font-medium cursor-pointer hover:underline">
                  {currentState === "Sign Up" ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AuthPage
