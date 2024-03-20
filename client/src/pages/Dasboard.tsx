import React from "react";
import Map from "../components/Map";
import TaskTable from "./tasks/taskTable";
import Sidebar from "../components/SideBar";
const Dasboard = () => {
  return (
    <div className="flex bg-orange-100 w-screen h-screen">
      <Sidebar />
      <Map width={600} height={600}  />
    </div>
  );
};

export default Dasboard;
