import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/SideBar";
import Button from "../../components/Button";
import Filter from "../../assets/filter.png";

interface Task {
  robotName: string;
  userName: string;
  taskStartTime: string;
  Targets: {
    Position: {
      x: string;
      y: string;
      z: string;
    };
    Orientation: {
      x: string;
      y: string;
      z: string;
      w: string;
    };
    targetExecuted: boolean;
    locationName: string;
  }[];
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
  };
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      retrieveTasks();
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  const retrieveTasks = async () => {
    try {
      const response = await axios.get("/tasks/getTasks");
      setTasks(response.data.data);
    } catch (error) {
      toast.error("Failed to retrieve tasks");
    }
  };

  const applyFilter = (taskCode: string) => {
    if (taskCode === "All") {
      setFilter("");
    } else {
      setFilter(taskCode);
    }
    setIsDropdownOpen(false);
  };

  const clearFilter = () => {
    setFilter("");
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (!filter) return true;
      return task.Task.taskCode === filter;
    })
    .reverse();
  return (
    <div className="flex items-center justify-center pl-20 bg-red-200">
      <Sidebar />
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Robot Name</th>
            <th className="px-4 py-2">Given By</th>
            <th className="px-4 py-2">
              Task Code
              <div className="relative inline-block text-left ml-2">
                <Button
                  id="options-menu"
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img src={Filter} alt="filter" width={20} height={20} />
                </Button>
                {isDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="py-1" role="none">
                      <Button
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                        onClick={() => applyFilter("All")}
                      >
                        All
                      </Button>
                      <Button
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                        onClick={() => applyFilter("Patrol")}
                      >
                        Patrol
                      </Button>
                      <Button
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                        onClick={() => applyFilter("Docking")}
                      >
                        Docking
                      </Button>
                      <Button
                        className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                        onClick={() => applyFilter("Docking")}
                      >
                        Lift
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </th>
            <th className="px-4 py-2">Task Name</th>
            <th className="px-4 py-2">Task Percentage</th>
            <th className="px-4 py-2">Task Priority</th>
            <th className="px-4 py-2">Task Start Time</th>
            <th className="px-4 py-2">Task Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{task.robotName}</td>
              <td className="border px-4 py-2">{task.userName}</td>
              <td className="border px-4 py-2">{task.Task.taskCode}</td>
              <td className="border px-4 py-2">{task.Task.taskName}</td>
              <td className="border px-4 py-2">{task.Task.taskPercentage}</td>
              <td className="border px-4 py-2">{task.Task.taskPriority}</td>
              <td className="border px-4 py-2">{task.taskStartTime}</td>
              <td className="border px-4 py-2">
                {task.Targets &&
                  task.Targets.map((target, idx) => (
                    <div key={idx}>
                      <p>Location Name: {target.locationName}</p>
                      <p>
                        Target Executed:
                        {target.targetExecuted ? "Yes" : "No"}
                      </p>
                    </div>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
