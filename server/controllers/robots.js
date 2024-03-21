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
      linearVelocity,
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
      linearVelocity: linearVelocity,
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
exports.getCurrentRobotVelocity = async (req, res, next) => {
  try {
    const { robotName } = req.params;
    const robot = await Robot.findOne({ robotName: robotName });

    if (!robot) {
      return res.status(404).json({
        success: false,
        message: "Robot not found",
      });
    }

    const { robotVelocity } = robot;
    res.status(200).json({
      success: true,
      data: robotVelocity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.getRobotInfo = async (req, res, next) => {
  try {
    const { robotName } = req.params;
    const robot = await Robot.findOne({ robotName: robotName });
    if (!robot) {
      return res.status(404).json({
        success: false,
        message: "Robot not found",
      });
    }
    res.status(200).json({
      success: true,
      data: robot,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.updateRobotInfo = async (req, res, next) => {
  try {
    const { robotName } = req.params;
    const { robotStatus } = req.body;

    const robot = await Robot.findOne({ robotName: robotName });

    if (!robot) {
      return res.status(404).json({
        success: false,
        message: "Robot not found",
      });
    }

    robot.robotStatus = robotStatus;

    await robot.save();

    res.status(200).json({
      success: true,
      message: "Robot status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
