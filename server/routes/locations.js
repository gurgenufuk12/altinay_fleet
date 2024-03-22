const express = require("express");
const router = express.Router();

const { getLocations } = require("../controllers/locations");

router.get("/getLocations", getLocations);

module.exports = router;
