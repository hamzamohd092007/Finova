import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePage = ({ user, currencySign, setUser, handleLogout, handleDelete }) => {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  if (isDeletingAccount) {
    return (
      <div className="w-screen h-screen p-4 flex items-center justify-center bg-amber-50">
        <div className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-neutral-200">
          <h2 className="text-2xl font-bold text-red-500">
            Warning
          </h2>
          <p className="text-neutral-600">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeletingAccount(false)} className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 transition cursor-pointer">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-white transition">
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-800">
            Profile
          </h1>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neutral-200">
                <img
                  src={user?.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  {user?.fullName}
                </h2>
                <p className="text-neutral-500 mt-1">
                  {user?.email}
                </p>
                <p className="text-sm text-neutral-400 mt-2">
                  Currency: {currencySign}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="px-5 py-3 rounded-2xl bg-neutral-900 text-white hover:bg-black transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-md p-5">
            <p className="text-neutral-500 text-sm">
              Current Balance
            </p>
            <h2 className="text-2xl font-bold text-neutral-800 mt-2">
              {currencySign}{(user?.currentBalance).toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-md p-5">
            <p className="text-neutral-500 text-sm">
              Monthly Income
            </p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {currencySign}{(user?.income).toFixed(2)}
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-md p-5">
            <p className="text-neutral-500 text-sm">
              Monthly Expenses
            </p>
            <h2 className="text-2xl font-bold text-red-500 mt-2">
              {currencySign}{(user?.expenses).toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-red-200 shadow-md p-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            Danger Zone
          </h3>
          <p className="text-neutral-500 mb-5">
            Permanently delete your account and all financial data.
          </p>
          <button onClick={() => setIsDeletingAccount(true)} className="px-5 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;