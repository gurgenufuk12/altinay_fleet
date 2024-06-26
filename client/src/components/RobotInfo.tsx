import React from "react";
import axios from "axios";
import Robot from "../assets/amr.png";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface Robot {
  Pose: {
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
  };
  robotCharge: string;
  robotStatus: string;
  robotVelocity: {
    linearVelocity: string;
    angularVelocity: string;
  };
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
  }[];
  Task: {
    taskCode: string;
    taskName: string;
    taskPercentage: string;
    taskPriority: string;
  };
  robotName: string;
  _id: string;
}

interface RobotInfoProps {
  selectedRobot: Robot | null;
}

const RobotInfo: React.FC<RobotInfoProps> = ({ selectedRobot }) => {
  const [activeRobot, setActiveRobot] = React.useState<Robot | null>(null);
  const [robotStatus, setRobotStatus] = React.useState<string>("");
  const getRobotInfo = async () => {
    try {
      if (selectedRobot) {
        const res = await axios.get(
          `/robots/getRobotInfo/${selectedRobot._id}`
        );
        setActiveRobot(res.data.data);
        setRobotStatus(res.data.data.robotStatus);
      }
    } catch (error) {
      console.error("Error fetching robot info:", error);
    }
  };

  React.useEffect(() => {
    if (activeRobot) {
      if (activeRobot.Targets.length > 0) {
        const lastTarget = activeRobot.Targets[activeRobot.Targets.length - 1];
        if (lastTarget.targetExecuted && robotStatus === "Task In Progress") {
          toast.success(
            "Task Completed :" +
              " " +
              activeRobot.Task.taskCode +
              " " +
              format(new Date(), "MMMM do yyyy, h:mm:ss a") +
              " " +
              activeRobot.robotName
          );
        }
      }
    }
  }, [activeRobot]);
  React.useEffect(() => {
    const intervalId = setInterval(getRobotInfo, 500);

    return () => clearInterval(intervalId);
  }, [selectedRobot]);
  return (
    <div className="border-black border-1 h-[37.5rem] mt-6 w-[18.75rem] rounded-2xl p-4 flex flex-col gap-20 bg-rose-200">
      <h1 className="text-xl font-medium">Robot Information</h1>
      <div className="flex flex-col items-center">
        <div className="flex m-7">
          <img src={Robot} alt="robot" />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-m font-medium">
          Robot Name: {activeRobot?.robotName}
        </h1>
        <h1 className="text-m font-medium">
          Robot Status: {activeRobot?.robotStatus}
        </h1>
        <h1 className="text-m font-medium">
          Robot Charge: {activeRobot?.robotCharge + "%"}
        </h1>
        <h1 className="text-m font-medium">
          Robot Velocity: {activeRobot?.robotVelocity.linearVelocity + " m/s"}
        </h1>
        <h1 className="text-m font-medium">
          {robotStatus === "Idle"
            ? ""
            : "Task Name: " + activeRobot?.Task.taskName}
        </h1>
        <h1 className="text-m font-medium">
          {robotStatus === "Task In Progress"
            ? "Task Percentage: " + activeRobot?.Task.taskPercentage + "%"
            : ""}
        </h1>
        <h1 className="text-m font-medium">
          {robotStatus === "Task In Progress"
            ? "Task Priority: " + activeRobot?.Task.taskPriority
            : ""}
        </h1>
      </div>
    </div>
  );
};

export default RobotInfo;
