import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear token from localStorage or perform any other necessary cleanup
    localStorage.removeItem("token");
  };

  const authContextValue: AuthContextType = {
    isLoggedIn,
    handleLogin,
    handleLogout,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
