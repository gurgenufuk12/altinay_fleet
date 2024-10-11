const firebase = require("../db");
const Robot = require("../models/robot");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("robots");

exports.addRobot = async (req, res, next) => {
  try {
    const { robotName, robotId } = req.body;
    const robotRef = db.doc(robotId.trim());
    await robotRef.set({
      robotName: robotName,
      robotId: robotId,
      robotStatus: "Idle",
      robotCharge: "80",
      robotVelocity: {
        linearVelocity: "0.0",
        angularVelocity: "0.0",
      },
      Pose: {
        Position: {
          x: "0.0",
          y: "0.0",
          z: "0.0",
        },
        Orientation: {
          x: "0.0",
          y: "0.0",
          z: "0.0",
          w: "0.0",
        },
      },
      Targets: [],
      Task: {
        taskCode: "",
        taskName: "",
        taskPercentage: "",
        taskPriority: "",
        pathPoints: [],
        taskId: "",
      },
      createdCostmap: [],
    });
    res.status(200).json({
      success: true,
      message: `Robot with ID ${robotId} added successfully`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addTarget = async (req, res, next) => {
  try {
    const {
      targets,
      taskName,
      taskCode,
      taskId,
      taskPriority,
      robotId,
      linearVelocity,
      angularVelocity,
      pathPoints,
      robotStatus,
    } = req.body;
    const robotRef = db.doc(robotId.trim());
    if (robotRef === null) {
      return res.status(400).json({
        success: false,
        message: "Robot not found",
      });
    }
    await robotRef.update({
      robotStatus: robotStatus,
      robotVelocity: {
        linearVelocity: linearVelocity,
        angularVelocity: angularVelocity,
      },
      Task: {
        taskName: taskName,
        taskCode: taskCode,
        taskPriority: taskPriority,
        taskPercentage: "0",
        taskId: taskId,
        pathPoints: pathPoints,
      },
      Targets: targets.map((target) => ({
        Position: target.targetPosition,
        Orientation: target.targetOrientation,
        targetExecuted: target.targetExecuted,
        locationName: target.locationName,
        locationDescription: target.locationDescription,
      })),
    });
    res.status(200).json({
      success: true,
      message: `Targets added successfully to robot with ID ${robotId}`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getRobotInfo = async (req, res, next) => {
  try {
    const { robotId } = req.params;
    const robotRef = db.doc(robotId.trim());
    const robot = await robotRef.get();
    if (!robot.exists) {
      return res.status(404).json({
        success: false,
        message: "Robot not found",
      });
    }
    const robotData = robot.data();
    res.status(200).json({
      success: true,
      data: robotData,
    });
  } catch (error) {}
};
// exports.getCurrentRobotVelocity = async (req, res, next) => {
//   try {
//     const { robotId } = req.params;
//     const robotRef = db.doc(robotId.trim());
//     const robot = await robotRef.get();
//     if (!robot.exists) {
//       return res.status(404).json({
//         success: false,
//         message: "Robot not found",
//       });
//     }
//     const robotData = robot.data();
//     res.status(200).json({
//       success: true,
//       data: robotData.robotVelocity,
//     });
//   } catch (error) {}
// };
// exports.addTarget = async (req, res, next) => {
//   try {
//     const {
//       taskName,
//       taskCode,
//       taskId,
//       taskPriority,
//       taskPercentage,
//       robotName,
//       linearVelocity,
//       angularVelocity,
//       targets,
//       robotStatus,
//     } = req.body;
//     const robot = await Robot.findOne({ robotName: robotName });
//     if (!robot) {
//       return res.status(400).json({
//         success: false,
//         message: "Robot not found",
//       });
//     }
//     robot.robotStatus = robotStatus;
//     robot.Targets = targets.map((target) => ({
//       Position: target.targetPosition,
//       Orientation: target.targetOrientation,
//       targetExecuted: target.targetExecuted,
//       locationName: target.locationName,
//       locationDescription: target.locationDescription,
//     }));
//     robot.Task = {
//       taskName: taskName,
//       taskCode: taskCode,
//       taskPriority: taskPriority,
//       taskPercentage: taskPercentage,
//       taskId: taskId,
//     };
//     robot.robotVelocity = {
//       linearVelocity: linearVelocity,
//       angularVelocity: angularVelocity,
//     };

//     await robot.save();
//     res.status(200).json({
//       success: true,
//       data: robot,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.updateRobotInfo = async (req, res, next) => {
//   try {
//     const { _id } = req.params;
//     const { robotStatus } = req.body;

//     const robot = await Robot.findOne({ _id: _id });

//     if (!robot) {
//       return res.status(404).json({
//         success: false,
//         message: "Robot not found",
//       });
//     }

//     robot.robotStatus = robotStatus;

//     await robot.save();

//     res.status(200).json({
//       success: true,
//       message: "Robot status updated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
