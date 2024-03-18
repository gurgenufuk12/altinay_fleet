const Robot = require("../models/robot");

exports.getRobots = async (req, res, next) => {
  try {
    const robots = await Robot.find();
    res.status(200).json({
      success: true,
      data: robots,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addTarget = async (req, res, next) => {
  try {
    const {
      taskName,
      taskCode,
      taskPriority,
      taskPercentage,
      robotName,
      lineerVelocity,
      angularVelocity,
      targets,
    } = req.body;
    const robot = await Robot.findOne({ robotName: robotName });
    if (!robot) {
      return res.status(400).json({
        success: false,
        message: "Robot not found",
      });
    }
    robot.Targets = targets.map((target) => ({
      Position: target.targetPosition,
      Orientation: target.targetOrientation,
      targetExecuted: target.targetExecuted,
    }));
    robot.Task = {
      taskName: taskName,
      taskCode: taskCode,
      taskPriority: taskPriority,
      taskPercentage: taskPercentage,
    };
    robot.robotVelocity = {
      lineerVelocity: lineerVelocity,
      angularVelocity: angularVelocity,
    };

    await robot.save();
    res.status(200).json({
      success: true,
      data: robot,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
