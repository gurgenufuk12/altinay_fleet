const express = require("express");
const router = express.Router();

const { addTasks } = require("../controllers/tasks");
const { deleteTask } = require("../controllers/tasks");
const { updateSavedTask } = require("../controllers/tasks");
const { checkSaveTaskExists } = require("../controllers/tasks");

router.post("/addTasks", addTasks);
router.put("/deleteTask/:taskId", deleteTask);
router.put("/updateSavedTask/:taskId", updateSavedTask);
router.get("/checkSaveTaskExists/:taskName", checkSaveTaskExists);

module.exports = router;
