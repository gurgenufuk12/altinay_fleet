import React, { useState, useEffect } from "react";
import { Task } from "../../types/Task";
import Sidebar from "../../components/SideBar";
import Button from "../../components/Button";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import TaskInspector from "../../components/TaskInspector";
import Filter from "../../assets/filter.png";
import SearchIcon from "@mui/icons-material/Search";
import DynamicTable from "../../components/DynamicTable";

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
    const tasksRef = collection(db, "tasks");
    onSnapshot(tasksRef, (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Task),
      }));
      setTasks(tasks);
    });
  };

  const applyFilter = (taskCode: string) => {
    setFilter(taskCode === "All" ? "" : taskCode);
    setIsDropdownOpen(false);
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

  const filteredTasks = tasks
    .filter((task) => !filter || task.Task.taskCode === filter)
    .filter((task) => {
      const search = searchTerm.toLowerCase();
      return (
        task.robotName?.toLowerCase().includes(search) ||
        task.userName?.toLowerCase().includes(search) ||
        task.Task.taskCode?.toLowerCase().includes(search)
      );
    })
    .reverse();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskInspectorOpen(true);
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

        <DynamicTable
          data={filteredTasks}
          headers={[
            "Robot Name",
            "Robot Id",
            "Given By",
            "Task Code",
            "Task Name",
            "Task Percentage",
            "Task Priority",
            "Task Start Time",
            "Task Finish Time",
            "Task Details",
          ]}
          renderRow={(task, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <td className="px-4 py-2">{task.robotName}</td>
              <td className="px-4 py-2">{task.robotId}</td>
              <td className="px-4 py-2">{task.userName}</td>
              <td className="px-4 py-2">{task.Task.taskCode}</td>
              <td className="px-4 py-2">{task.Task.taskName}</td>
              <td className="px-4 py-2">{task.Task.taskPercentage}</td>
              <td className="px-4 py-2">{task.Task.taskPriority}</td>
              <td className="px-4 py-2">{formatDate(task.taskStartTime)}</td>
              <td className="px-4 py-2">
                {task.taskEndTime === "unknown"
                  ? "Mission In Progress"
                  : formatDate(task.taskEndTime)}
              </td>
              <td className="px-4 py-2">
                {task.Targets.map((target, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-sm">
                      <span className="font-semibold">Location {idx + 1}:</span>{" "}
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
          )}
        />

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
