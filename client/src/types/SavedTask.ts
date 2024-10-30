import { Target } from "./Target";
import { Task } from "./Task";

export interface SavedTask {
  Targets: Target[];
  robotName: string;
  userName: string;
  Task: Task;
}
