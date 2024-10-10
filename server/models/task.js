class Task {
  constructor(
    Targets = [],
    Task = {
      taskCode: String,
      taskName: String,
      taskPercentage: String,
      taskPriority: String,
      taskId: String,
    },
    robotName,
    robotId,
    userName,
    taskStartTime,
    taskEndTime,
    savedTask
  ) {
    this.Targets = Targets;
    this.Task = Task;
    this.robotName = robotName;
    this.robotId = robotId;
    this.userName = userName;
    this.taskStartTime = taskStartTime;
    this.taskEndTime = taskEndTime;
    this.savedTask = savedTask;
  }
}
