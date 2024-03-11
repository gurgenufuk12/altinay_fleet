import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.tsx";
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // State to track if admin is logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/signin" />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route
            path="/admin"
            element={<AdminLogin onLogin={handleAdminLogin} />}
          />
          <Route
            path="/adminPage"
            element={
              isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin" />
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
