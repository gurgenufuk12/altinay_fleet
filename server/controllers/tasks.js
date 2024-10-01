const firebase = require("../db");
const Task = require("../models/task");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("tasks");

exports.addTasks = async (req, res, next) => {
  try {
    const {
      userName,
      taskName,
      taskCode,
      taskPriority,
      taskPercentage,
      robotName,
      targets,
      taskStartTime,
      savedTask,
      taskId,
    } = req.body;
    const taskRef = db.doc(taskId.trim());
    await taskRef.set({
      taskName: taskName,
      taskCode: taskCode,
      taskPriority: taskPriority,
      taskPercentage: taskPercentage,
      taskId: taskId,
      robotName: robotName,
      userName: userName,
      taskStartTime: taskStartTime,
      taskEndTime: null,
      savedTask: savedTask,
      Targets: targets.map((target) => ({
        Position: target.targetPosition,
        Orientation: target.targetOrientation,
        targetExecuted: target.targetExecuted,
        locationName: target.locationName,
        locationDescription: target.locationDescription,
      })),
    });

    // Broadcast the new task
    // req.broadcast({ type: "new_task", data: task });

    res.status(200).json({
      success: true,
      message: "Task added successfully",
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
  console.log(taskId);
  try {
    const tasksSnapshot = await admin
      .firestore()
      .collection("tasks")
      .where("taskId", "==", taskId)
      .get();

    if (tasksSnapshot.empty) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatePromises = tasksSnapshot.docs.map((doc) => {
      return doc.ref.update({ savedTask: false });
    });

    await Promise.all(updatePromises);

    const updatedTasks = tasksSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    res.status(200).json({ deletedTasks: updatedTasks });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateSavedTask = async (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskCode, taskPriority, targets } = req.body;
  console.log(req.body);
  try {
    const taskRef = db.doc(taskId.trim());
    await taskRef.update({
      taskName: taskName,
      taskCode: taskCode,
      taskPriority: taskPriority,
      Targets: targets.map((target) => ({
        Position: target.targetPosition,
        Orientation: target.targetOrientation,
        targetExecuted: target.targetExecuted,
        locationName: target.locationName,
        locationDescription: target.locationDescription,
      })),
    });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating saved task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// exports.updateTask = async (req, res, next) => {
//   const { taskId } = req.params;
//   try {
//     const {
//       taskName,
//       taskCode,
//       taskPriority,
//       taskPercentage,
//       robotName,
//       targets,
//       taskStartTime,
//     } = req.body;
//     const task = await Task.findOneAndUpdate(
//       { "Task.taskId": taskId },
//       {
//         Task: {
//           taskId: taskId,
//           taskName: taskName,
//           taskCode: taskCode,
//           taskPriority: taskPriority,
//           taskPercentage: taskPercentage,
//         },
//         Targets: targets.map((target) => ({
//           Position: target.targetPosition,
//           Orientation: target.targetOrientation,
//           targetExecuted: target.targetExecuted,
//           locationName: target.locationName,
//           locationDescription: target.locationDescription,
//         })),
//         robotName: robotName,
//         taskStartTime: taskStartTime,
//       },
//       { new: true }
//     );
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     res.status(200).json({ updatedTask: task });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.updateTaskEndTime = async (req, res, next) => {
//   const { taskId } = req.params;
//   try {
//     const { taskEndTime } = req.body;
//     const task = await Task.findOneAndUpdate(
//       { "Task.taskId": taskId },
//       { taskEndTime: taskEndTime },
//       { new: true }
//     );
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     res.status(200).json({ updatedTask: task });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
