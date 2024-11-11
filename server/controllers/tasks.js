const taskService = require("../services/taskService");

exports.addTasks = async (req, res, next) => {
  try {
    await taskService.addTask(req.body);
    const taskData = req.body;
    const broadcastData = {
      type: "new_task",
      data: {
        Task: {
          taskName: taskData.taskName,
          taskCode: taskData.taskCode,
          taskPriority: taskData.taskPriority,
          taskPercentage: "0",
          taskId: taskData.taskId,
        },
        robotName: taskData.robotName,
        robotId: taskData.robotId,
        userName: taskData.userName,
        taskStartTime: taskData.taskStartTime,
        taskEndTime: taskData.taskEndTime,
        savedTask: taskData.savedTask,
        Targets: taskData.targets.map((target) => ({
          Position: target.Position,
          Orientation: target.Orientation,
          targetExecuted: target.targetExecuted,
          locationId: target.locationId,
          locationName: target.locationName,
          locationDescription: target.locationDescription,
        })),
      },
    };

    console.log(
      "Broadcasting the following data:",
      JSON.stringify(broadcastData, null, 2)
    );

    req.broadcast(broadcastData);
    res.status(200).json({
      success: true,
      message: `Task with ID ${req.body.taskId} added successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const deletedTasks = await taskService.deleteTask(taskId);
    res.status(200).json({ deletedTasks });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSavedTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await taskService.updateSavedTask(taskId, req.body);
    res.status(200).json({
      message: `Task with ID ${taskId} updated successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
