import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify/unstyled";
import { Slide } from "react-toastify";

import { auth, createUserWithEmailAndPassword } from "../firebase/fireabseconf";
import EyeOpen from "../assets/icons/eye-open.svg";
import EyeClosed from "../assets/icons/eye-closed.svg";
import SignUpProviders from "./SignUpProviders";

const SignupModal = () => {

  const navigator = useNavigate();
  const success = () => toast.success("Account created successfully. Redirecting to login", {
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
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires a uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Must be same as password")
  })

  const formik = useFormik<{ email: string, password: string, confirmPassword: string }>(
    {
      initialValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: schema,
      onSubmit: (values) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then(_ => {
            success()
            setTimeout(() => { navigator("/login") }, 5000)
          })
          .catch((error: any) => {
            if (error.code === "auth/email-already-in-use") {
              errormsg("An account is already registered with this email")
            }
          })
      },
    }
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
      <h1 className="text-4xl font-bold" >Hello,</h1>
      <h1 className="text-4xl font-bold" >Welcome!</h1>
      <p className="text-gray-400">Hey, welcome to FireFin</p>
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
          <input type={"password"} className="bg-white w-full py-1.5 px-2 outline-none rounded-sm border-2 border-gray-200 mt-2" placeholder="Retype password" name="confirmPassword" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
          {
            formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 font-bold">{formik.errors.confirmPassword}</div>
            ) : null
          }

          <button type="submit" className="text-lg bg-green-300 hover:bg-green-500 px-5 py-3 rounded-lg font-bold outline-none mt-10">Sign up</button>
          <p className="text-gray-400">Already have an account? <Link to="/login" className="underline">Login now</Link></p>
        </form>
      </div>
    </div>

  )

}

export default SignupModal;
