const mongoose = require("mongoose");

const poseSchema = new mongoose.Schema({
  Position: {
    x: String,
    y: String,
    z: String,
  },
  Orientation: {
    x: String,
    y: String,
    z: String,
    w: String,
  },
});

const targetSchema = new mongoose.Schema({
  Position: {
    x: String,
    y: String,
    z: String,
  },
  Orientation: {
    x: String,
    y: String,
    z: String,
    w: String,
  },
  targetExecuted: Boolean,
});

const taskSchema = new mongoose.Schema({
  taskCode: String,
  taskName: String,
  taskPercentage: String,
  taskPriority: String,
});

const robotSchema = new mongoose.Schema({
  Pose: poseSchema,
  robotCharge: String,
  robotStatus: String,
  robotVelocity: {
    lineerVelocity: String,
    angularVelocity: String,
  },
  Targets: [targetSchema],
  Task: taskSchema,
  robotName: String,
});

module.exports = mongoose.model("Robot", robotSchema);
