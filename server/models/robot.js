class Robot {
  constructor(
    robotId,
    robotName,
    robotStatus,
    robotCharge,
    robotVelocity = { linearVelocity: String, angularVelocity: String },
    Pose = {
      Position: { x: String, y: String, z: String },
      Orientation: { x: String, y: String, z: String, w: String },
    },
    Targets = [],
    Task = {
      taskCode: String,
      taskName: String,
      taskPercentage: String,
      taskPriority: String,
      pathPoints: [{ x: String, y: String }],
      taskId: String,
    },
    createdCostmap = [{ x: String, y: String }]
  ) {
    this.robotId = robotId;
    this.robotName = robotName;
    this.robotStatus = robotStatus;
    this.robotCharge = robotCharge;
    this.robotVelocity = robotVelocity;
    this.Pose = Pose;
    this.targets = Targets;
    this.task = Task;
    this.createdCostmap = createdCostmap;
  }
}

// robotSchema.post("save", function (doc) {
//   eventEmitter.emit("robotSaved", doc);
// });
// eventEmitter.on("robotSaved", async (robot) => {
//   const updateRobotStatus = (robot) => {
//     if (robot.Targets[robot.Targets.length - 1].targetExecuted) {
//       try {
//         axios.put(`http://localhost:8000/robots/updateRobotInfo/${robot._id}`, {
//           robotStatus: "Idle",
//         });
//       } catch (error) {
//         console.log(error);
//       }
//       try {
//         axios.put(
//           `http://localhost:8000/tasks/updateTaskEndTime/${robot.Task._id}`,
//           {
//             taskEndTime: new Date().toISOString(),
//           }
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };
//   const updateTask = async () => {
//     try {
//       const robots = await axios.get(`http://localhost:8000/robots/getRobots`);
//       for (let robot of robots.data.data) {
//         if (robot.robotStatus === "Task In Progress") {
//           try {
//             const res = await axios.put(
//               `http://localhost:8000/tasks/updateTask/${robot.Task.taskId}`,
//               {
//                 taskName: robot.Task.taskName,
//                 taskCode: robot.Task.taskCode,
//                 taskPriority: robot.Task.taskPriority,
//                 taskPercentage: robot.Task.taskPercentage,
//                 targets: robot.Targets.map((target) => ({
//                   targetPosition: target.Position,
//                   targetOrientation: target.Orientation,
//                   targetExecuted: target.targetExecuted,
//                   locationName: target.locationName,
//                   locationDescription: target.locationDescription,
//                 })),
//               }
//             );
//             updateRobotStatus(robot);
//           } catch (error) {
//             if (
//               error.response &&
//               error.response.data.message === "Task not found"
//             ) {
//               console.log(`Task not found, retrying...`);
//             } else {
//               console.log(error.response.data.message);
//             }
//           }
//         }
//       }
//       setTimeout(updateTask, 2000);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   updateTask();
// });
// module.exports = mongoose.model("Robot", robotSchema);
