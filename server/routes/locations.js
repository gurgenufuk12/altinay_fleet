const express = require("express");
const router = express.Router();

const { getLocations } = require("../controllers/locations");
const { addLocation } = require("../controllers/locations");

router.get("/getLocations", getLocations);
router.post("/addLocation", addLocation);

module.exports = router;
