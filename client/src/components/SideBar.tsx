import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    if (user && user.user_Role === "admin") {
      setIsUserAdmin(true);
    }
  }, [user]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <div className="fixed top-0 left-0 h-full  bg-gray-800 text-white w-60">
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {user ? `Welcome, ${user.username}` : "Welcome"}
        </h1>

        <ul>
          <li
            className="py-2 hover:bg-gray-700"
            onClick={() => handleNavigation("/")}
          >
            Dashboard
          </li>
          <li
            className="py-2 hover:bg-gray-700"
            onClick={() => handleNavigation("/tasks")}
          >
            Task History
          </li>

          {isUserAdmin && (
            <li
              className="py-2 hover:bg-gray-700"
              onClick={() => handleNavigation("/adminPage")}
            >
              Admin Dashboard
            </li>
          )}
        </ul>
      </div>
      <button
        className="absolute bottom-0 w-full p-4 bg-red-500 text-white"
        onClick={() => {
          setUser(null);
          handleLogout();
          navigate("/signin");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
