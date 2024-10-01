class Task {
  constructor(
    Targets = [],
    Task,
    robotName,
    userName,
    taskStartTime,
    taskEndTime,
    savedTask
  ) {
    this.Targets = Targets;
    this.Task = Task;
    this.robotName = robotName;
    this.userName = userName;
    this.taskStartTime = taskStartTime;
    this.taskEndTime = taskEndTime;
    this.savedTask = savedTask;
  }
}
