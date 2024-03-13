const express = require("express");
const router = express.Router();

const { getRobots } = require("../controllers/robots");

router.get("/getRobots", getRobots);
module.exports = router;
