import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/SideBar";
import Button from "../../components/Button";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import TaskInspector from "../../components/TaskInspector";
import Filter from "../../assets/filter.png";
import SearchIcon from "@mui/icons-material/Search";

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
    locationDescription: string;
  }[];
  taskCode: string;
  taskName: string;
  taskPercentage: string;
  taskPriority: string;
  taskId: string;
  taskEndTime: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskInspectorOpen, setIsTaskInspectorOpen] =
    useState<boolean>(false);

  useEffect(() => {
    retrieveTasks();
  }, []);

  const retrieveTasks = () => {
    try {
      const tasksRef = collection(db, "tasks");

      onSnapshot(tasksRef, (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Task),
        }));

        setTasks(tasks);
      });
    } catch (error) {
      console.log("Error fetching saved tasks: ", error);
    }
  };

  const applyFilter = (taskCode: string) => {
    setFilter(taskCode === "All" ? "" : taskCode);
    setIsDropdownOpen(false);
  };

  const clearFilter = () => {
    setFilter("");
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (!filter) return true;
      return task.taskCode === filter;
    })
    .filter((task) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        task.robotName?.toLowerCase().includes(search) ||
        task.userName?.toLowerCase().includes(search) ||
        task.taskCode?.toLowerCase().includes(search) ||
        task.taskName?.toLowerCase().includes(search) ||
        task.taskPriority?.toLowerCase().includes(search) ||
        task.taskPercentage?.toLowerCase().includes(search) ||
        task.taskStartTime?.toLowerCase().includes(search) ||
        (task.Targets &&
          task.Targets.some(
            (target) =>
              target.locationName?.toLowerCase().includes(search) ||
              (target.locationDescription &&
                target.locationDescription?.toLowerCase().includes(search)) ||
              target.targetExecuted.toString().toLowerCase().includes(search)
          ))
      );
    })
    .reverse();
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskInspectorOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100 min-h-screen ml-60">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task Management</h1>

          <div className="relative flex gap-10">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 pl-8 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={Filter} alt="filter" className="inline w-5 h-5 mr-2" />{" "}
              Filter
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  {["All", "Patrol", "Docking", "Lift"].map((taskCode) => (
                    <Button
                      key={taskCode}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                      onClick={() => applyFilter(taskCode)}
                    >
                      {taskCode}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              {[
                "Robot Name",
                "Given By",
                "Task Code",
                "Task Name",
                "Task Percentage",
                "Task Priority",
                "Task Start Time",
                "Task Finish Time",
                "Task Details",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-medium tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <td className="px-4 py-2">{task.robotName}</td>
                <td className="px-4 py-2">{task.userName}</td>
                <td className="px-4 py-2">{task.taskCode}</td>
                <td className="px-4 py-2">{task.taskName}</td>
                <td className="px-4 py-2">{task.taskPercentage}</td>
                <td className="px-4 py-2">{task.taskPriority}</td>
                <td className="px-4 py-2">{formatDate(task.taskStartTime)}</td>
                <td className="px-4 py-2">
                  {task.taskEndTime
                    ? formatDate(task.taskEndTime)
                    : "Not Finished"}
                </td>
                <td className="px-4 py-2">
                  {task.Targets.map((target, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-sm">
                        <span className="font-semibold">
                          Location {idx + 1}:
                        </span>{" "}
                        {target.locationName}
                      </p>
                      <p className="text-sm">
                        Target Executed:{" "}
                        <span
                          className={
                            target.targetExecuted
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {target.targetExecuted ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedTask && isTaskInspectorOpen && (
          <TaskInspector
            task={selectedTask}
            onClose={() => setIsTaskInspectorOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskTable;
