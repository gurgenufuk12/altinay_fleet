import React from "react";
import Map from "./Map.tsx";
import TaskTable from "./tasks/taskTable.tsx";
import Sidebar from "../components/SideBar.tsx";

const Dasboard = () => {
  return (
    <div className="flex items-center justify-center mt-10">
      <Sidebar  />
      <Map width={600} height={600}  />
      <TaskTable />
    </div>
  );
};

export default Dasboard;
