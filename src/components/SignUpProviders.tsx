import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, GoogleAuthProvider, signInAnonymously, signInWithPopup } from "../firebase/fireabseconf";
import Google from "../assets/icons/google.svg"
import Anon from "../assets/icons/anon.svg"

const SignUpProviders: React.FC<{ errorToast: (msg: string) => void, }> = ({ errorToast }) => {

  const [showAnonWarning, setShowAnonWarning] = useState<boolean>(false);
  const googleProvider = new GoogleAuthProvider();
  const navigator = useNavigate();

  const handleGoogleSignIn = () => {

    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigator("/");
      })
      .catch((error: any) => {
        if (error.code === "auth/internal-error") {
          errorToast("There was an issue with our server, please try again in a few minutes. Or check to see if your internet is working")
        }
        else {
          errorToast("Unexpected error occured")
          console.error("There was an error: ", error);
        }
      })

  }

  const handleAnonSignIn = () => {
    signInAnonymously(auth)
      .then(() => {
        setShowAnonWarning(false);
        navigator("/");
      }
      )
      .catch((error: any) => {
        errorToast("Unexpected error occured")
        console.error("There was an error: ", error);
      })
  }

  return (
    <>
      <div className={`absolute left-0 top-0 min-w-screen min-h-screen bg-gray-400 z-10 opacity-40 ${!showAnonWarning ? "hidden" : "block"}`}>
      </div>
      <div className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white z-20 px-2 py-4 rounded-md shadow-2xl flex flex-col gap-4 ${!showAnonWarning ? "hidden" : "block"}`}>
        <h3 className="text-xl font-bold">No data is saved if you sign in anonymously</h3>
        <button className="self-end-safe bg-amber-300 mt-2 px-2 py-2 rounded-lg font-medium" onClick={handleAnonSignIn}>Continue?</button>
      </div>
      <button className={`absolute z-10 top-0 right-0 mr-2 mt-2 font-bold text-4xl outline-none hover:cursor-pointer ${!showAnonWarning ? "hidden" : "block"}`} onClick={() => { setShowAnonWarning(false) }}>⨯</button>
      <button className="w-full border-2 py-1 rounded-lg relative flex items-center hover:cursor-pointer" onClick={handleGoogleSignIn}>
        <img src={Google} alt="Google icon" className="inline size-5 ml-5" />
        <p className="mx-auto">Sign in with google</p>
      </button >
      <button className="w-full border-2 py-1 rounded-lg relative flex items-center hover:cursor-pointer" onClick={() => { setShowAnonWarning(true) }}>
        <img src={Anon} alt="Anon icon" className="inline size-5 ml-5" />
        <p className="mx-auto">Sign in anonymously</p>
      </button>
    </>

  )
}

export default SignUpProviders;
