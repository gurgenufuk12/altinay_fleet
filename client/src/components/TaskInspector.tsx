import React from "react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={taskInspectorWindow}
        className="bg-white rounded-lg p-6 relative flex flex-col w-4/5 lg:w-2/3 xl:w-1/2 h-4/5 gap-5 shadow-lg overflow-y-auto"
      >
        <Button
          onClick={onClose}
          className="absolute top-0 right-0 text-lg p-2 rounded-full hover:bg-gray-200"
        >
          <CloseIcon className="text-black" />
        </Button>
        <div className="flex flex-col md:flex-row h-full gap-10">
          <div className="flex-1 flex flex-col gap-5 bg-gray-100 p-6 rounded-xl font-sans shadow-inner">
            <h2 className="text-xl font-bold text-center">Task Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Robot Name:</span>{" "}
                {task.robotName}
              </p>
              <p>
                <span className="font-semibold">User Name:</span>{" "}
                {task.userName}
              </p>
              <p>
                <span className="font-semibold">Task Code:</span>{" "}
                {task.Task.taskCode}
              </p>
              <p>
                <span className="font-semibold">Task Name:</span>{" "}
                {task.Task.taskName}
              </p>
              <p>
                <span className="font-semibold">Task Priority:</span>{" "}
                {task.Task.taskPriority}
              </p>
              <p>
                <span className="font-semibold">Task Start Time:</span>{" "}
                {formatDate(task.taskStartTime)}
              </p>
              <p>
                <span className="font-semibold">Task End Time:</span>{" "}
                {task.taskEndTime ? formatDate(task.taskEndTime) : "Not Finished"}
              </p>
              <p>
                <span className="font-semibold">Task Percentage:</span>{" "}
                {task.Task.taskPercentage}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-5 bg-gray-100 p-6 rounded-xl font-sans shadow-inner">
            <h2 className="text-xl font-bold text-center">Task Logs</h2>
            <div className="space-y-4">
              {task.Targets.map((target, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="font-semibold">Target {index + 1}</p>
                  <p>
                    <span className="font-semibold">Location Name:</span>{" "}
                    {target.locationName}
                  </p>
                  <p>
                    <span className="font-semibold">Location Description:</span>{" "}
                    {target.locationDescription}
                  </p>
                  <p>
                    <span className="font-semibold">Target Executed:</span>{" "}
                    <span
                      className={`font-bold ${
                        target.targetExecuted ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {target.targetExecuted ? "Yes" : "No"}
                    </span>
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
