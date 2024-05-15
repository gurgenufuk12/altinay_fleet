const express = require("express");
const router = express.Router();

const { getTasks } = require("../controllers/tasks");
const { addTasks } = require("../controllers/tasks");
const { getSavedTasks } = require("../controllers/tasks");
const { deleteTask } = require("../controllers/tasks");
const { updateTask } = require("../controllers/tasks");
const { isTaskNameExist } = require("../controllers/tasks");
const { getTaskByName } = require("../controllers/tasks");

router.get("/getTasks", getTasks);
router.get("/getSavedTasks", getSavedTasks);
router.post("/addTasks", addTasks);
router.put("/deleteTask/:_id", deleteTask);
router.put("/updateTask/:taskId", updateTask);
router.get("/isTaskNameExist/:taskName", isTaskNameExist);


module.exports = router;
