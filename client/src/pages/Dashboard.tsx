import React from "react";
import axios from "axios";
import Map from "../components/Map";
import TaskTable from "./tasks/taskTable";
import Sidebar from "../components/SideBar";

const Dashboard = () => {
  const [token, setToken] = React.useState<string | null>("");

  React.useEffect(() => {
    const token = sessionStorage.getItem("userData");
    if (token) {
      setToken(token);
    }
  }, []);
  
  return (
    <div className="flex bg-orange-100 w-screen h-screen">
      <Sidebar token={token} />
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full h-full">
          <Map width={600} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
