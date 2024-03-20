import React from "react";
import axios from "axios";
import Robot from "../assets/amr.png";

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
  robotName: string;
}

interface RobotInfoProps {
  selectedRobot: Robot | null;
}

const RobotInfo: React.FC<RobotInfoProps> = ({ selectedRobot }) => {
  const [activeRobot, setActiveRobot] = React.useState<Robot | null>(null);

  const getRobotInfo = async () => {
    try {
      if (selectedRobot) {
        const res = await axios.get(
          `/robots/getRobotInfo/${selectedRobot.robotName}`
        );
        setActiveRobot(res.data.data);
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
    <div className="border-black border-2 h-[37.5rem] mt-6 w-[18.75rem] rounded-2xl p-4 flex flex-col gap-20">
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
          Robot Charge: {activeRobot?.robotCharge}
        </h1>
        <h1 className="text-m font-medium">
          Robot Velocity: {activeRobot?.robotVelocity.linearVelocity + " m/s"}
        </h1>
        <h1 className="text-m font-medium">
          Task Name: {activeRobot?.Task.taskName}
        </h1>
        <h1 className="text-m font-medium">
          Task Percentage: {activeRobot?.Task.taskPercentage}
        </h1>
      </div>
    </div>
  );
};

export default RobotInfo;
