import React, { useEffect, useState } from "react";
import { database, ref, get, remove, set } from "../firebase/fireabseconf";
import { useAuth } from "../firebase/AuthContext";
import Sort from "../assets/icons/sort.svg";
import SortAsc from "../assets/icons/sort-asc.svg";

export type ExpenseRecord = {
  id: string;
  date: string;
  amount: number;
  tag: string;
  type: "Credit" | "Debit";
};

const ExpenseRecords: React.FC = () => {
  const [originalData, setOriginalData] = useState<ExpenseRecord[]>([]);
  const [data, setData] = useState<ExpenseRecord[]>([]);
  const [dateSortAsc, setDateSortAsc] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterType, setFilterType] = useState<"Credit" | "Debit" | "">("");

  const { currentUser } = useAuth();

  useEffect(() => {
    const getData = async () => {
      if (!currentUser?.uid) return;
      const recordsRef = ref(database, `${currentUser.uid}/records`);
      const snapshot = await get(recordsRef);
      const snapshotVal: { [id: string]: ExpenseRecord } = snapshot.val()

      const originalUnsortedData = (Object.values(snapshotVal) as ExpenseRecord[]);
      originalUnsortedData.sort((a: ExpenseRecord, b: ExpenseRecord) => new Date(b["date"]).getTime() - new Date(a["date"]).getTime())
      setOriginalData(originalUnsortedData)

    };

    getData();
  }, [currentUser?.uid]);

  // Filter and sort when originalData or filters change
  useEffect(() => {
    let filtered = [...originalData];

    if (filterDate) {
      filtered = filtered.filter((item) =>
        item.date.toLowerCase().includes(filterDate.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (dateSortAsc) {
      filtered.reverse();
    }

    setData(filtered);
  }, [originalData, filterDate, filterType, dateSortAsc]);

  const handleResetFilters = () => {
    setFilterDate("");
    setFilterType("");
    setDateSortAsc(false);
    setData([...originalData]);
  };

  const toggleDateSort = () => {
    setDateSortAsc((prev) => !prev);
  };

  const deleteRecord = async (id: string, type: string, amount: number) => {
    if (!currentUser?.uid) return;

    const newData = [...data];
    newData.splice(newData.findIndex(curr => curr.id === id), 1)
    setData(newData);
    setOriginalData(newData);


    const balanceRef = ref(database, `${currentUser?.uid}/balance`);
    const balanceSnapshot = await get(balanceRef);
    let balanceVal = balanceSnapshot.exists() ? balanceSnapshot.val() : 0;

    const incomeRef = ref(database, `${currentUser?.uid}/income`);
    const incomeSnapshot = await get(incomeRef);
    let incomeVal = incomeSnapshot.exists() ? incomeSnapshot.val() : 0;

    const expenseRef = ref(database, `${currentUser?.uid}/expense`);
    const expenseSnapshot = await get(expenseRef);
    let expenseVal = expenseSnapshot.exists() ? expenseSnapshot.val() : 0;

    if (type === "Debit") {
      expenseVal -= amount;
      balanceVal += amount;
      await set(expenseRef, expenseVal);
    }
    else {
      incomeVal -= amount;
      balanceVal -= amount;
      await set(incomeRef, incomeVal);
    }

    await set(balanceRef, balanceVal)

    const recordsRef = ref(database, `${currentUser.uid}/records/${id}`);
    await remove(recordsRef);

  };

  return (
    <div className="w-full text-white overflow-x-auto px-2">
      <table className="min-w-[640px] w-full text-sm text-left border border-white/10">
        <thead className="bg-gray-800 h-[40px]">
          <tr className="text-center">
            <th>Sr</th>
            <th className="relative px-4 py-2 text-left align-top">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <button
                    title="Sort"
                    onClick={toggleDateSort}
                    className="hover:cursor-pointer"
                  >
                    <img src={dateSortAsc ? Sort : SortAsc} alt="Sort" className="size-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-xs bg-gray-700 text-white px-2 py-1 rounded w-[100px] placeholder:text-gray-300"
                />
              </div>
            </th>
            <th>Tag</th>
            <th>Amount</th>
            <th className="relative px-4 py-2 text-left align-top">
              <div className="flex flex-col items-end gap-1">
                <span>Type</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as "Credit" | "Debit" | "")}
                  className="text-xs bg-gray-700 text-white px-2 py-1 rounded w-[100px]"
                >
                  <option value="">All</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((curr, i) => (
            <tr key={i} className="text-center bg-slate-800">
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{curr.date}</td>
              <td className="py-2">{curr.tag}</td>
              <td className="py-2">{curr.amount}</td>
              <td className="py-2">
                <span
                  className={`text-white text-sm px-2 py-1 rounded-md ${curr.type === "Credit" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {curr.type}
                </span>
              </td>
              <td className="py-2">
                <button onClick={() => { deleteRecord(curr.id, curr.type, curr.amount) }} className="underline inline cursor-pointer">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reset Filters Button */}
      <div className="w-full flex justify-end mt-2 pr-2">
        <button
          onClick={handleResetFilters}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-md"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseRecords;
