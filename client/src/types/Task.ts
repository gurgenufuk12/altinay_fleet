import { Target } from "./Target";
import { TaskInfo } from "./TaskInfo";

export interface Task {
  Targets: Target[];
  robotName: string;
  userName: string;
  Task: TaskInfo;
  savedTask: boolean;
  robotId: string;
  taskEndTime: string;
  taskStartTime: string;
}
