import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, signOut, deleteUser } from "../firebase/fireabseconf.ts";
import { useAuth } from "../firebase/AuthContext";
import ExpenseRecords from "./ExpenseRecords.tsx";

const ExpenseTable: React.FC = () => {
  const { currentUser } = useAuth();
  const navigator = useNavigate();

  const [showSettings, setShowSettings] = useState<boolean>(false);


  const handleLogout = () => {
    if (currentUser?.isAnonymous) {
      deleteUser(currentUser).then(() => navigator("/"));
    } else {
      signOut(auth).then(() => navigator("/"));
    }
  };

  return (
    <div className="w-full px-4 py-2">
      <div className="w-full flex justify-between items-center relative mb-3">
        <button
          title="Add Record"
          className="rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors duration-150 size-9 md:size-10 text-white text-xl flex items-center justify-center shadow-md"
          onClick={() =>
            navigator("/add")
          }
        >
          +
        </button>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            title="Settings"
            className="rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors duration-150 size-9 md:size-10 text-white text-xl flex items-center justify-center shadow-md"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </button>

          {/* Dropdown */}
          <div
            className={`${showSettings ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } absolute top-[120%] right-0 origin-top-right transition-all duration-200 ease-out bg-[#0f172a] text-white rounded-md shadow-lg p-3 w-40 z-20`}
          >
            <p className="text-sm mb-2 text-gray-300">Filter Records</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-1.5 rounded-md transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <ExpenseRecords />
    </div>
  );
};

export default ExpenseTable;
