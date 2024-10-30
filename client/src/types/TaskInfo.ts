export interface TaskInfo {
  taskCode: string;
  taskName: string;
  taskPercentage: string;
  taskPriority: string;
  taskId: string;
  pathPoints?: [string, string][];
}
