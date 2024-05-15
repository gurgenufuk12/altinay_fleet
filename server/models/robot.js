const mongoose = require("mongoose");
const events = require("events");
const axios = require("axios");
const eventEmitter = new events.EventEmitter();

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
  locationName: String,
  locationDescription: String,
});

const taskSchema = new mongoose.Schema({
  taskCode: String,
  taskName: String,
  taskPercentage: String,
  taskPriority: String,
  pathPoints: [[String, String]],
});

const robotSchema = new mongoose.Schema({
  Pose: poseSchema,
  robotCharge: String,
  robotStatus: String,
  robotVelocity: {
    linearVelocity: String,
    angularVelocity: String,
  },
  Targets: [targetSchema],
  Task: taskSchema,
  robotName: String,
  createdCostmap: [[String, String]],
});
robotSchema.post("save", function (doc) {
  eventEmitter.emit("robotSaved", doc);
});
eventEmitter.on("robotSaved", async (robot) => {
  const updateRobotStatus = (robot) => {
    if (robot.Targets[robot.Targets.length - 1].targetExecuted) {
      try {
        axios.put(`http://localhost:8000/robots/updateRobotInfo/${robot._id}`, {
          robotStatus: "Idle",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const updateTask = async () => {
    try {
      const robots = await axios.get(`http://localhost:8000/robots/getRobots`);
      for (let robot of robots.data.data) {
        if (robot.robotStatus === "Task In Progress") {
          try {
            const res = await axios.put(
              `http://localhost:8000/tasks/updateTask/${robot.Task._id}`,
              {
                taskName: robot.Task.taskName,
                taskCode: robot.Task.taskCode,
                taskPriority: robot.Task.taskPriority,
                taskPercentage: robot.Task.taskPercentage,
                targets: robot.Targets.map((target) => ({
                  targetPosition: target.Position,
                  targetOrientation: target.Orientation,
                  targetExecuted: target.targetExecuted,
                  locationName: target.locationName,
                  locationDescription: target.locationDescription,
                })),
              }
            );
            updateRobotStatus(robot);
          } catch (error) {
            if (
              error.response &&
              error.response.data.message === "Task not found"
            ) {
              console.log(`Task not found, retrying...`);
            } else {
              console.log(error.response.data.message);
            }
          }
        }
      }
      setTimeout(updateTask, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  updateTask();
});
module.exports = mongoose.model("Robot", robotSchema);
