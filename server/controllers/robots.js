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
      targetPosition,
      targetOrientation,
      targetExecuted,
    } = req.body;
    const robot = await Robot.findOne({ robotName: robotName });
    if (!robot) {
      return res.status(400).json({
        success: false,
        message: "Robot not found",
      });
    }
    robot.Target = {
      Position: targetPosition,
      Orientation: targetOrientation,
      targetExecuted: targetExecuted,
    };
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
