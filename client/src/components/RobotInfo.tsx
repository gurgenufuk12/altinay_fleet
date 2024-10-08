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
    const intervalId = setInterval(getRobotInfo, 500);

    return () => clearInterval(intervalId);
  }, [selectedRobot]);
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <h1 className="text-xl font-medium">Robot Information</h1>
      <img src={Robot} alt="robot" className="w-36" />
      {activeRobot && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="font-medium">Robot Name:</span>
            <span>{activeRobot.robotName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Robot Status:</span>
            <span>{activeRobot.robotStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Robot Charge:</span>
            <span>{activeRobot.robotCharge}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Robot Velocity:</span>
            <span>{activeRobot.robotVelocity.linearVelocity} m/s</span>
          </div>
          {robotStatus !== "Idle" && (
            <>
              <div className="flex justify-between">
                <span className="font-medium">Task Name:</span>
                <span>{activeRobot.Task.taskName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Task Percentage:</span>
                <span>{activeRobot.Task.taskPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Task Priority:</span>
                <span>{activeRobot.Task.taskPriority}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RobotInfo;
