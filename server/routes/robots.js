const express = require("express");
const router = express.Router();

const { addTarget } = require("../controllers/robots");
const { addRobot } = require("../controllers/robots");

router.post("/addTarget", addTarget);
router.post("/addRobot", addRobot);

module.exports = router;
