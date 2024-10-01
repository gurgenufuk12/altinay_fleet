const express = require("express");
const router = express.Router();

const { addLocation } = require("../controllers/locations");
const { deleteLocation } = require("../controllers/locations");
const { checkLocationExist } = require("../controllers/locations");

router.post("/addLocation", addLocation);
router.delete("/deleteLocation/:locationName", deleteLocation);
router.get("/checkLocationExist/:locationName", checkLocationExist);

module.exports = router;
