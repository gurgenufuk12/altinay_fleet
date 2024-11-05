const firebase = require("../db");
const admin = require("firebase-admin");
const db = firebase.collection("tasks");

async function addTask(taskData) {
  const {
    taskId,
    taskName,
    taskCode,
    taskPriority,
    taskPercentage,
    robotName,
    robotId,
    userName,
    taskStartTime,
    taskEndTime,
    savedTask,
    targets,
  } = taskData;
  const taskRef = db.doc(taskId.trim());
  await taskRef.set({
    Task: {
      taskName: taskName,
      taskCode: taskCode,
      taskPriority: taskPriority,
      taskPercentage: taskPercentage,
      taskId: taskId,
    },
    robotName: robotName,
    robotId: robotId,
    userName: userName,
    taskStartTime: taskStartTime,
    taskEndTime: taskEndTime,
    savedTask: savedTask,
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

async function deleteTask(taskId) {
  const tasksSnapshot = await admin
    .firestore()
    .collection("tasks")
    .where("Task.taskId", "==", taskId)
    .get();

  if (tasksSnapshot.empty) {
    throw new Error("Task not found");
  }

  const updatePromises = tasksSnapshot.docs.map((doc) =>
    doc.ref.update({ savedTask: false })
  );
  await Promise.all(updatePromises);

  return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function updateSavedTask(taskId, taskData) {
  const { taskName, taskCode, taskPriority, targets } = taskData;
  const taskRef = db.doc(taskId.trim());
  await taskRef.update({
    Task: {
      taskName: taskName,
      taskCode: taskCode,
      taskPriority: taskPriority,
      taskId: taskId,
      taskPercentage: "0",
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
  addTask,
  deleteTask,
  updateSavedTask,
};
