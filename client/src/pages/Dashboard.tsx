import React from "react";
import axios from "axios";
import Map from "../components/Map";
import TaskTable from "./tasks/taskTable";
import Sidebar from "../components/SideBar";

const Dashboard = () => {
  return (
    <div className="flex bg-orange-100 w-screen h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full h-full">
          <Map width={600} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
