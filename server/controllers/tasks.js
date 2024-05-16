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
      taskId,
    } = req.body;
    const task = new Task({
      Task: {
        taskName: taskName,
        taskCode: taskCode,
        taskPriority: taskPriority,
        taskPercentage: taskPercentage,
        taskId: taskId,
      },
      Targets: targets.map((target) => ({
        Position: target.targetPosition,
        Orientation: target.targetOrientation,
        targetExecuted: target.targetExecuted,
        locationName: target.locationName,
        locationDescription: target.locationDescription,
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
};
exports.deleteTask = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: _id },
      { savedTask: false },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ deletedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const {
      taskName,
      taskCode,
      taskPriority,
      taskPercentage,
      robotName,
      targets,
      taskStartTime,
    } = req.body;
    const task = await Task.findOneAndUpdate(
      { "Task.taskId": taskId },
      {
        Task: {
          taskId: taskId,
          taskName: taskName,
          taskCode: taskCode,
          taskPriority: taskPriority,
          taskPercentage: taskPercentage,
        },
        Targets: targets.map((target) => ({
          Position: target.targetPosition,
          Orientation: target.targetOrientation,
          targetExecuted: target.targetExecuted,
          locationName: target.locationName,
          locationDescription: target.locationDescription,
        })),
        robotName: robotName,
        taskStartTime: taskStartTime,
      },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ updatedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.isTaskNameExist = async (req, res, next) => {
  const { taskName } = req.params;
  try {
    const task = await Task.findOne({ "Task.taskName": taskName });
    if (task) {
      return res.status(200).json({ isExist: true });
    }
    res.status(200).json({ isExist: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateTaskEndTime = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const { taskEndTime } = req.body;
    const task = await Task.findOneAndUpdate(
      { "Task.taskId": taskId },
      { taskEndTime: taskEndTime },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ updatedTask: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
