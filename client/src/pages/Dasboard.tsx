import React from "react";
import Map from "../components/Map";
import TaskTable from "./tasks/taskTable";
import Sidebar from "../components/SideBar";
const Dasboard = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <Sidebar />
      <Map width={600} height={600} />
    </div>
  );
};

export default Dasboard;
