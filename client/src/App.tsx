import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TaskTable from "./pages/tasks/taskTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />}
            />
          }
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/adminPage" element={<AdminDashboard />} />
          <Route path="/tasks" element={<TaskTable />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
