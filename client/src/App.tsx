import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TaskTable from "./pages/tasks/TaskTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/adminPage"
            element={<ProtectedRoute component={AdminDashboard} adminOnly />}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute component={TaskTable} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
