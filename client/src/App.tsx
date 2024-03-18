import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dasboard from "./pages/Dasboard";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TaskTable from "./pages/tasks/taskTable";
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
            element={isLoggedIn ? <Dasboard /> : <Navigate to="/signin" />}
          />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/" element={<Dasboard />} /> */}
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
          <Route path="/tasks" element={<TaskTable />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
