import { RobotPose } from "./RobotPose";
import { Target } from "./Target";
import { Task } from "./Task";

export interface Robot {
  Pose: RobotPose;
  Targets: Target[];
  Task: Task;
  robotCharge: string;
  robotStatus: string;
  robotName: string;
  robotId: string;
  robotVelocity: {
    linearVelocity: string;
    angularVelocity: string;
  };
}
