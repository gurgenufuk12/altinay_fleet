import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext"; // Import the useUserContext hook

const Sidebar: React.FC = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setUser } = useUserContext(); // Use the useUserContext hook to access the user context

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
    </div>
  );
};

export default Sidebar;
