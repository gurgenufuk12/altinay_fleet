import React from "react";
import axios from "axios";
interface User {
  id: string;
  username: string;
}
const Sidebar = () => {
  const [token, setToken] = React.useState<string | null>("");
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    const token = localStorage.getItem("userData");
    if (token) {
      setToken(token);
    }
  }, []);

  React.useEffect(() => {
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
    fetchUser();
  }, [token]);
  return (
    <div className="fixed top-0 left-0 h-full  bg-gray-800 text-white w-60">
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {user ? `Welcome, ${user.username}` : "Welcome"}
        </h1>
        <ul>
          <li
            className="py-2 hover:bg-gray-700"
            onMouseDown={() => {
              window.location.href = "/";
            }}
          >
            Dashboard
          </li>
          <li
            className="py-2 hover:bg-gray-700"
            onMouseDown={() => {
              window.location.href = "/tasks";
            }}
          >
            Task History
          </li>
          {/* <li className="py-2 hover:bg-gray-700">Menu Item 3</li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
