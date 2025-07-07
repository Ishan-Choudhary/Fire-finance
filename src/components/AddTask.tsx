import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Slide, toast, ToastContainer } from "react-toastify";

import { database, ref, get, set } from "../firebase/fireabseconf";
import { useAuth } from "../firebase/AuthContext";

const AddTask: React.FC = () => {
  const { currentUser } = useAuth();
  const errorMsg = (msg: string) => toast.error(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    draggable: false,
    progress: undefined,
    theme: "colored",
    transition: Slide,
  });
  const navigator = useNavigate();

  const date = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const tags = ["Food 🍜", "Income 💰", "Entertainment 📺", "Lifestyle 🏋️‍♂️"];

  const schema = yup.object({
    month: yup.string().oneOf(months, "Can only be one of the 12 options"),
    year: yup.number().required("Required"),
    date: yup
      .number()
      .min(1, "Cannot be less than 1")
      .required("Required")
      .when(["month", "year"], ([month, year], schema) => {
        if (!month || !year) return schema;
        const lastDay = new Date(year, months.indexOf(month) + 1, 0).getDate();
        return schema.max(lastDay, `Cannot be more than ${lastDay}`);
      }),
    tag: yup.string().oneOf(tags).required("Pick a sector"),
    amt: yup.number().min(1, "Cannot be less than 1").required("Required"),
    type: yup.string().oneOf(["Credit", "Debit"]).required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      date: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      tag: "Income 💰",
      amt: 1,
      type: "Credit",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        //ADD BALANCE
        const balanceRef = ref(database, `${currentUser?.uid}/balance`);
        const balanceSnapshot = await get(balanceRef);
        let balanceVal = balanceSnapshot.exists() ? balanceSnapshot.val() : 0;

        const incomeRef = ref(database, `${currentUser?.uid}/income`);
        const incomeSnapshot = await get(incomeRef);
        let incomeVal = incomeSnapshot.exists() ? incomeSnapshot.val() : 0;

        const expenseRef = ref(database, `${currentUser?.uid}/expense`);
        const expenseSnapshot = await get(expenseRef);
        let expenseVal = expenseSnapshot.exists() ? expenseSnapshot.val() : 0;

        if (values.type === "Debit") {
          if (values.amt > balanceVal) {
            throw new Error("Insufficient Funds");
          }
          else {
            expenseVal += values.amt;
            balanceVal -= values.amt;
            await set(expenseRef, expenseVal);
            await set(balanceRef, balanceVal);
          }
        }
        else {
          incomeVal += values.amt;
          balanceVal += values.amt;
          await set(incomeRef, incomeVal);
          await set(balanceRef, balanceVal);
        }


        //ADD RECORD
        const dateRef = `${values.date} ${values.month} ${values.year}`;
        const id = crypto.randomUUID();
        const newRecordRef = ref(database, `${currentUser?.uid}/records/${id}`);

        const submitValue = {
          "id": id,
          "date": dateRef,
          "tag": values.tag,
          "type": values.type,
          "amount": values.amt,
        }


        await set(newRecordRef, submitValue).then(_ => navigator("/"));

      }
      catch (err: unknown) {
        if (err instanceof Error) {
          errorMsg(err.message);
        }
        else {
          errorMsg("An unknown error occured");
          console.error("Unknown error occured", err)
        }
      }
    },
  });

  const inputClass =
    "w-full py-2 px-3 mt-1 bg-transparent text-white border border-gray-500 rounded-md focus:outline-none focus:border-blue-400";

  const errorClass =
    "absolute top-full mt-1 text-sm text-red-500 font-semibold bg-[#fee2e2] border border-red-400 rounded p-2 z-10";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        theme="colored"
        transition={Slide}
      />
      <div className="p-6 w-full max-w-xl bg-[#111827]/70 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg mx-2">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">Add a record</h1>
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={formik.handleSubmit}
        >
          {/* Date */}
          <div className="w-full">
            <label htmlFor="date" className="text-white font-medium">
              Date
            </label>
            <div className="flex gap-2">
              <div className="relative w-16">
                <input
                  type="number"
                  name="date"
                  className={inputClass}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                />
                {formik.touched.date && typeof formik.errors.date === "string" && (
                  <div className={errorClass}>{formik.errors.date}</div>
                )}
              </div>
              <div className="relative w-28">
                <select
                  name="month"
                  className={inputClass}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.month}
                >
                  {months.map((m) => (
                    <option key={m} value={m} className="text-black">
                      {m}
                    </option>
                  ))}
                </select>
                {formik.touched.month && typeof formik.errors.month === "string" && (
                  <div className={errorClass}>{formik.errors.month}</div>
                )}
              </div>
              <div className="relative w-24">
                <input
                  type="number"
                  name="year"
                  className={inputClass}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.year}
                />
                {formik.touched.year && typeof formik.errors.year === "string" && (
                  <div className={errorClass}>{formik.errors.year}</div>
                )}
              </div>
            </div>
          </div>

          {/* Tag */}
          <div className="relative w-full">
            <label htmlFor="tag" className="text-white font-medium">
              Tag
            </label>
            <select
              name="tag"
              className={inputClass + " mt-2"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tag}
            >
              {tags.map((tag) => (
                <option key={tag} value={tag} className="text-black">
                  {tag}
                </option>
              ))}
            </select>
            {formik.touched.tag && typeof formik.errors.tag === "string" && (
              <div className={errorClass}>{formik.errors.tag}</div>
            )}
          </div>

          {/* Type */}
          <div className="relative w-full">
            <label htmlFor="type" className="text-white font-medium">
              Transaction Type
            </label>
            <select
              name="type"
              className={inputClass + " mt-2"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type}
            >
              {["Credit", "Debit"].map((type) => (
                <option key={type} value={type} className="text-black">
                  {type}
                </option>
              ))}
            </select>
            {formik.touched.type && typeof formik.errors.type === "string" && (
              <div className={errorClass}>{formik.errors.type}</div>
            )}
          </div>

          {/* Amount */}
          <div className="relative w-full">
            <label htmlFor="amt" className="text-white font-medium">
              Amount
            </label>
            <input
              type="number"
              name="amt"
              className={inputClass + " mt-2"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amt}
            />
            {formik.touched.amt && typeof formik.errors.amt === "string" && (
              <div className={errorClass}>{formik.errors.amt}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full font-bold px-10 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 hover:shadow-md transition-all duration-150"
          >
            Add
          </button>
          <button
            type="button"
            className="w-full font-bold px-10 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 hover:shadow-md transition-all duration-150"
            onClick={() => { navigator("/") }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
