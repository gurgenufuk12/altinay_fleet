import React from "react";
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserContextProvider, useUserContext } from "./contexts/UserContext";

const App = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  return (
    <>
      <UserContextProvider>
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/adminPage" element={<AdminDashboard />} />
            <Route path="/tasks" element={<TaskTable />} />
          </Routes>
        </Router>
      </UserContextProvider>
    </>
  );
};

export default App;
