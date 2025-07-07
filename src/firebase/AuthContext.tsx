import React, { useEffect, useState, type ReactNode } from "react";
import { auth, onAuthStateChanged, type User, type Auth } from "./fireabseconf.ts"

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  auth: Auth;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading, auth }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot use useAuth hook outside a provider")
  }

  return context
}

export {
  AuthProvider,
  useAuth,
}
