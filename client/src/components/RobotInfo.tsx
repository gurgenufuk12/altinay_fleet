import React from "react";

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
  selectedRobot: Robot | null; // Define the props interface for RobotInfo component
}

const RobotInfo: React.FC<RobotInfoProps> = ({ selectedRobot }) => {
  return (
    <div className="border-black border-2 h-[37.5rem] mt-6 w-[18.75rem] rounded-2xl p-4 flex flex-col">
      <h1 className="text-xl font-medium">Robot Information</h1>
      <div className="flex flex-col items-center">
        <div className="flex bg-black m-7 w-10 h-10"></div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-m font-medium">
          Robot Name: {selectedRobot?.robotName}
        </h1>
        <h1 className="text-m font-medium">
          Robot Status: {selectedRobot?.robotStatus}
        </h1>
        <h1 className="text-m font-medium">
          Robot Charge: {selectedRobot?.robotCharge}
        </h1>
        <h1 className="text-m font-medium">
          Robot Velocity: {selectedRobot?.robotVelocity.linearVelocity}
        </h1>
        <h1 className="text-m font-medium">
          Task Name: {selectedRobot?.Task.taskName}
        </h1>
        <h1 className="text-m font-medium">
          Task Percentage: {selectedRobot?.Task.taskPercentage}
        </h1>
      </div>
    </div>
  );
};

export default RobotInfo;
