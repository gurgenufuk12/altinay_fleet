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
      targetPosition,
      targetOrientation,
      targetExecuted,
      taskStartTime,
    } = req.body;
    const task = new Task({
      Task: {
        taskName: taskName,
        taskCode: taskCode,
        taskPriority: taskPriority,
        taskPercentage: taskPercentage,
      },
      Target: {
        Position: targetPosition,
        Orientation: targetOrientation,
        targetExecuted: targetExecuted,
      },
      robotName: robotName,
      userName: userName,
      taskStartTime: taskStartTime,
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
