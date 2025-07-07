import React, { useState, useEffect } from "react";
import CountUp from "react-countup";

import { database, ref, onValue } from "../firebase/fireabseconf";
import { useAuth } from "../firebase/AuthContext";
import ExpenseTable from "./ExpenseTable";

const Home: React.FC = () => {

  const { currentUser } = useAuth();

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const balanceRef = ref(database, `${currentUser?.uid}/balance`);
      onValue(balanceRef, (balanceSnapshot) => {
        const balanceVal = balanceSnapshot.exists() ? balanceSnapshot.val() : 0;
        setBalance(balanceVal);
      })

      const incomeRef = ref(database, `${currentUser?.uid}/income`);
      onValue(incomeRef, (incomeSnapshot) => {
        const incomeVal = incomeSnapshot.exists() ? incomeSnapshot.val() : 0;
        setIncome(incomeVal);
      })

      const expenseRef = ref(database, `${currentUser?.uid}/expense`);
      onValue(expenseRef, (expenseSnapshot) => {
        const expenseVal = expenseSnapshot.exists() ? expenseSnapshot.val() : 0;
        setExpense(expenseVal);
      })
    }
    fetchData();
  }, [])

  return (

    <>

      <div className="flex flex-wrap justify-center gap-4 py-6 px-4 bg-[#0f172a]">

        {/* Balance */}
        <div className="bg-[#1e293b] rounded-xl shadow-md p-6 min-w-[250px] text-center flex-1 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-md font-medium text-gray-300">Balance</h3>
          <p className="text-2xl font-bold text-white">
            $ <CountUp end={balance} duration={2} />
          </p>
        </div>

        {/* Income */}
        <div className="bg-[#13271f] border border-green-400 rounded-xl shadow-md p-6 min-w-[250px] text-center flex-1 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-md font-medium text-green-400">Income</h3>
          <p className="text-2xl font-bold text-green-400">
            $ <CountUp end={income} duration={2} />
          </p>
        </div>

        {/* Expense */}
        <div className="bg-[#2a1e1e] border border-red-400 rounded-xl shadow-md p-6 min-w-[250px] text-center flex-1 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-md font-medium text-red-400">Expense</h3>
          <p className="text-2xl font-bold text-red-400">
            $ <CountUp end={expense} duration={2} />
          </p>
        </div>

      </div>
      <ExpenseTable />
    </>

  )
}

export default Home;
