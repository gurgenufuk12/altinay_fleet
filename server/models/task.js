const mongoose = require("mongoose");

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
  locationName: String,
  locationDescription: String,
});

const taskSchema = new mongoose.Schema({
  taskCode: String,
  taskName: String,
  taskPercentage: String,
  taskPriority: String,
});

const tasksSchema = new mongoose.Schema({
  Targets: [targetSchema],
  Task: taskSchema,
  robotName: String,
  userName: String,
  taskStartTime: String,
  savedTask: Boolean,
});

module.exports = mongoose.model("Task", tasksSchema);
