const express = require("express");
const router = express.Router();

const { addTarget } = require("../controllers/robots");
const { addRobot } = require("../controllers/robots");
// const { getCurrentRobotVelocity } = require("../controllers/robots");
// const { updateRobotInfo } = require("../controllers/robots");

router.post("/addTarget", addTarget);
router.post("/addRobot", addRobot);
// router.get("/getCurrentRobotVelocity/:robotName", getCurrentRobotVelocity);
// router.put("/updateRobotInfo/:_id", updateRobotInfo);

module.exports = router;
