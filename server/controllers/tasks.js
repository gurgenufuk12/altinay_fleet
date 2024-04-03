const Task = require("../models/task");

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addTasks = async (req, res, next) => {
  try {
    const {
      userName,
      taskName,
      taskCode,
      taskPriority,
      taskPercentage,
      robotName,
      targets,
      taskStartTime,
      savedTask,
    } = req.body;
    const task = new Task({
      Task: {
        taskName: taskName,
        taskCode: taskCode,
        taskPriority: taskPriority,
        taskPercentage: taskPercentage,
      },
      Targets: targets.map((target) => ({
        Position: target.targetPosition,
        Orientation: target.targetOrientation,
        targetExecuted: target.targetExecuted,
      })),
      robotName: robotName,
      userName: userName,
      taskStartTime: taskStartTime,
      savedTask: savedTask,
    });
    await task.save();
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSavedTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ savedTask: true });
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}