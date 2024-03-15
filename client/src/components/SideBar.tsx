import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-40 bg-gray-800 text-white">
      <div className="p-4">
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
