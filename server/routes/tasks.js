const express = require("express");
const router = express.Router();

const { getTasks } = require("../controllers/tasks");
const { addTasks } = require("../controllers/tasks");

router.get("/getTasks", getTasks);
router.post("/addTasks", addTasks);

module.exports = router;
