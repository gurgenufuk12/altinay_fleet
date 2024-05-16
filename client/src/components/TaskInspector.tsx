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
    taskEndTime: string;
  };
  onClose: () => void;
}

const TaskInspector: React.FC<TaskInspectorProps> = ({ task, onClose }) => {
  const taskInspectorWindow = React.useRef<HTMLDivElement>(null);

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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div
        ref={taskInspectorWindow}
        className="bg-white rounded-lg p-8 relative flex flex-col w-3/5 h-3/5 gap-5"
      >
        <span className="flex flex-end">
          <Button onClick={onClose} className="absolute top-4 right-4  text-lg">
            <CloseIcon className="text-black" />
          </Button>
        </span>
        <div className="flex flex-row">
          <div className="bg-white rounded w-1/2 h-full flex-col flex gap-5">
            <p>Task Details</p>
            <span>
              <p>Robot Name: {task.robotName}</p>
              <p>User Name: {task.userName}</p>
              <p>Task Code: {task.Task.taskCode}</p>
              <p>Task Name: {task.Task.taskName}</p>
              <p>Task Priority: {task.Task.taskPriority}</p>
              <p>Task Start Time: {formatDate(task.taskStartTime)}</p>
              <p>Task End Time: {formatDate(task.taskEndTime)}</p>
              <p>Task Percentage: {task.Task.taskPercentage}</p>
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <span>Task Logs</span>
            <div>
              {task.Targets.map((target, index) => (
                <div className="flex flex-row gap-5">
                  <p>Target: {index + 1}</p>
                  <span>
                    <p>Location Name: {target.locationName}</p>
                    <p>Location Description: {target.locationDescription}</p>
                    <p>
                      Target Executed:
                      {target.targetExecuted ? "Yes" : "No"}
                    </p>
                  </span>
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
