import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  user_Role: string;
}
interface SidebarProps {
  token: string | null;
}
const Sidebar: React.FC<SidebarProps> = ({ token }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/getUserByToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchUser();
    }
  }, [token]);
  console.log(user);
  console.log(token);
  return (
    <div className="fixed top-0 left-0 h-full  bg-gray-800 text-white w-60">
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {user ? `Welcome, ${user.username}` : "Welcome"}
        </h1>

        <ul>
          <li
            className="py-2 hover:bg-gray-700"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Dashboard
          </li>
          <li
            className="py-2 hover:bg-gray-700"
            onClick={() => {
              window.location.href = "/tasks";
            }}
          >
            Task History
          </li>

          <li
            className="py-2 hover:bg-gray-700"
            onClick={() => {
              window.location.href = "/adminPage";
            }}
          >
            Admin Dashboard
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
