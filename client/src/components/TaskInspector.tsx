import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";

interface TaskInspectorProps {
  task: {
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
    Task: {
      taskCode: string;
      taskName: string;
      taskPercentage: string;
      taskPriority: string;
      taskId: string;
    };
  };
  onClose: () => void;
}

const TaskInspector: React.FC<TaskInspectorProps> = ({ task, onClose }) => {
  const taskInspectorWindow = React.useRef<HTMLDivElement>(null);
  const [taskPercentage, setTaskPercentage] = React.useState<string>("");

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        taskInspectorWindow.current &&
        !taskInspectorWindow.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div
        ref={taskInspectorWindow}
        className="bg-white rounded-lg p-8 relative flex flex-col w-3/5 h-3/5"
      >
        <span className="flex flex-row">
          <h2>Task Details</h2>
          <Button onClick={onClose} className="absolute top-4 right-4  text-lg">
            <CloseIcon className="text-black" />
          </Button>
        </span>
        <div className="flex flex-row">
          <div className="bg-white p-8 rounded w-1/2 h-full">
            <p>Robot Name: {task.robotName}</p>
            <p>User Name: {task.userName}</p>
            <p>Task Code: {task.Task.taskCode}</p>
            <p>Task Name: {task.Task.taskName}</p>
            <p>Task Priority: {task.Task.taskPriority}</p>
            <p>Task Start Time: {task.taskStartTime}</p>
            <p>Task Percentage: {task.Task.taskPercentage}</p>
            <div>
              {task.Targets &&
                task.Targets.map((target, idx) => (
                  <div key={idx}>
                    <p>Location Name: {target.locationName}</p>
                    <p>Location Description: {target.locationDescription}</p>
                    <p>
                      Target Executed:
                      {target.targetExecuted ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInspector;
