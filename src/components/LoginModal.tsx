import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Slide, toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import EyeOpen from "../assets/icons/eye-open.svg";
import EyeClosed from "../assets/icons/eye-closed.svg";
import { auth, signInWithEmailAndPassword } from "../firebase/fireabseconf";
import SignUpProviders from "./SignUpProviders";

const LoginModal = () => {

  const navigator = useNavigate();
  const errormsg = (msg: string) => toast.error(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
    transition: Slide,
  });

  const schema = yup.object({
    email: yup.string().email().required("Required"),
    password: yup
      .string()
      .required("Required")
  });

  const formik = useFormik<{ email: string, password: string }>(
    {
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: schema,
      onSubmit: (values) => {
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then(() => {
            navigator("/");
          })
          .catch((error: any) => {
            if (error.code === "auth/invalid-credential") {
              errormsg("Incorrect email or passsword")
            }
            else {
              errormsg("Unexpected error encountered");
            }
          })
      }
    },
  )

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const showPasswordFn = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (

    <div className="px-2 w-7/10 py-2 lg:w-[342px]">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
      <h1 className="text-4xl font-bold" >Hi,</h1>
      <h1 className="text-4xl font-bold" >Welcome back!</h1>
      <p className="text-gray-400">Hey, welcome back to FireFin</p>
      <div className="mt-10 flex flex-col gap-2">
        <SignUpProviders errorToast={errormsg} />
        <form className="text-sm font-normal text-left" onSubmit={formik.handleSubmit}>
          <input type="email" className="w-full bg-white rounded-sm border-2 border-gray-200 py-1.5 px-2" placeholder="Email " name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
          {
            formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 font-bold">{formik.errors.email}</div>
            ) : null
          }
          <div className="rounded-sm border-2 border-gray-200 mt-2 flex justify-between px-2">
            <input type={showPassword ? "text" : "password"} className="bg-white py-1.5 pr-2 outline-none" placeholder="Password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
            <button className="inline hover:cursor-pointer" onClick={showPasswordFn}>
              <img src={showPassword ? EyeOpen : EyeClosed} alt="View password" className="inline" />
            </button>
          </div>
          {
            formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 font-bold">{formik.errors.password}</div>
            ) : null
          }
          <button type="submit" className="text-lg bg-green-300 hover:bg-green-500 px-5 py-3 rounded-lg font-bold outline-none mt-10">Login</button>
          <p className="text-gray-400">Don't have an account? <Link to="/signup" className="underline">Sign up now</Link></p>
        </form>
      </div>
    </div>

  )

}

export default LoginModal;
