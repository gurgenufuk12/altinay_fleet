import { RobotPose } from "./RobotPose";
import { Target } from "./Target";
import { TaskInfo } from "./TaskInfo";

export interface Robot {
  Pose: RobotPose;
  Targets: Target[];
  Task: TaskInfo;
  robotCharge: string;
  robotStatus: string;
  robotName: string;
  robotId: string;
  robotVelocity: {
    linearVelocity: string;
    angularVelocity: string;
  };
  createdCostmap: [string, string][];
}
