import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CreateTask from "./CreateTask";
import AddRobot from "./AddRobot";
import { AuthContext } from "../contexts/AuthContext";
import Button from "./Button";
import AddIcon from "@mui/icons-material/Add";

const Sidebar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.userProfile;
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [showAddRobot, setShowAddRobot] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userRole === "admin") {
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
        <Button
          className="py-2 w-full mt-4 rounded-lg bg-orange-400"
          onClick={() => setShowCreateTask(true)}
        >
          {<AddIcon />}
          Create Task
        </Button>
        {showCreateTask && (
          <CreateTask onClose={() => setShowCreateTask(false)} />
        )}
        <Button
          className="py-2 w-full mt-4 rounded-lg bg-orange-400"
          onClick={() => setShowAddRobot(true)}
        >
          {<AddIcon />}
          Add Robot
        </Button>
        {showAddRobot && <AddRobot onClose={() => setShowAddRobot(false)} />}
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
      <Button
        className="absolute bottom-0 w-full p-4 bg-red-500 text-white"
        onClick={() => {
          authContext?.logout();
          navigate("/signin");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
