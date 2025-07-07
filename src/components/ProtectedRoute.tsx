import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../firebase/AuthContext";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { currentUser, loading } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigator("/login");
    }
  }, [loading, currentUser])

  if (loading) {
    return <h1>Checking authentication...</h1>;
  }

  if (!currentUser) {
    return <h1>Not logged in, returning you to login page</h1>;
  }

  return (
    <div className="min-w-screen min-h-screen bg-slate-900 ">
      {children}
    </div>
  )
}

export default ProtectedRoute;
