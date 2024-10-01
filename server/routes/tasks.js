const express = require("express");
const router = express.Router();

const { addTasks } = require("../controllers/tasks");
const { deleteTask } = require("../controllers/tasks");
const { updateSavedTask } = require("../controllers/tasks");
// const { updateTask } = require("../controllers/tasks");
// const { updateTaskEndTime } = require("../controllers/tasks");
router.post("/addTasks", addTasks);
router.put("/deleteTask/:taskId", deleteTask);
router.put("/updateSavedTask/:taskId", updateSavedTask);
// router.put("/updateTask/:taskId", updateTask);
// router.put("/updateTaskEndTime/:taskId", updateTaskEndTime);

module.exports = router;
