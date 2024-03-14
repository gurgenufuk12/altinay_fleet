const express = require("express");
const router = express.Router();

const { getRobots } = require("../controllers/robots");
const { addTarget } = require("../controllers/robots");



router.get("/getRobots", getRobots);
router.post("/addTarget", addTarget);

module.exports = router;
