const express = require("express");
const router = express.Router();

const { getRobots } = require("../controllers/robots");
const { addTarget } = require("../controllers/robots");
const { getCurrentRobotVelocity } = require("../controllers/robots");
const { getRobotInfo } = require("../controllers/robots");
const { updateRobotInfo } = require("../controllers/robots");

router.get("/getRobots", getRobots);
router.post("/addTarget", addTarget);
router.get("/getCurrentRobotVelocity/:robotName", getCurrentRobotVelocity);
router.get("/getRobotInfo/:_id", getRobotInfo);
router.put("/updateRobotInfo/:_id", updateRobotInfo);

module.exports = router;
