const firebase = require("../db");
const admin = require("firebase-admin");
const db = firebase.collection("robots");

async function addRobot(robotData) {
  const { robotName, robotId } = robotData;
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
}
async function addTarget(targetData) {
  const {
    targets,
    taskName,
    taskCode,
    taskId,
    taskPriority,
    linearVelocity,
    angularVelocity,
    pathPoints,
    robotStatus,
    robotId,
  } = targetData;
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
      Position: target.Position,
      Orientation: target.Orientation,
      targetExecuted: target.targetExecuted,
      locationId: target.locationId,
      locationName: target.locationName,
      locationDescription: target.locationDescription,
    })),
  });
}

module.exports = {
  addRobot,
  addTarget,
};
