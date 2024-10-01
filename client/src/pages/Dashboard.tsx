import React from "react";
import Map from "../components/Map";
import Sidebar from "../components/SideBar";

const Dashboard = () => {
  return (
    <div className="flex w-full h-screen bg-orange-300">
      <Sidebar />
      <Map width={600} height={600} />
    </div>
  );
};

export default Dashboard;
