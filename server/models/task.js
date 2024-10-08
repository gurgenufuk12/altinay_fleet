class Task {
  constructor(
    Targets = [],
    Task,
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
