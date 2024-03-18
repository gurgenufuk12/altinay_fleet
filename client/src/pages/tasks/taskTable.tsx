import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../components/SideBar";
interface Task {
  robotName: string;
  Target: {
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
  };
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
  };
}
const TaskTable = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);

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

  return (
    // show side bar and table of tasks
    <div className="flex items-center justify-center mt-10 ">
      <Sidebar />
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Robot Name</th>
            <th className="px-4 py-2">Task Code</th>
            <th className="px-4 py-2">Task Name</th>
            <th className="px-4 py-2">Task Percentage</th>
            <th className="px-4 py-2">Task Priority</th>
            <th className="px-4 py-2">Target Position</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{task.robotName}</td>
              <td className="border px-4 py-2">{task.Task.taskCode}</td>
              <td className="border px-4 py-2">{task.Task.taskName}</td>
              <td className="border px-4 py-2">{task.Task.taskPercentage}</td>
              <td className="border px-4 py-2">{task.Task.taskPriority}</td>
              <td className="border px-4 py-2">
                {task.Target.Position.x}, {task.Target.Position.y},{" "}
                {task.Target.Position.z}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
