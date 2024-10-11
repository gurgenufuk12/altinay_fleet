const express = require("express");
const router = express.Router();

const { addLocation } = require("../controllers/locations");
const { deleteLocation } = require("../controllers/locations");
const { checkLocationExist } = require("../controllers/locations");
const { updateLocation } = require("../controllers/locations");

router.post("/addLocation", addLocation);
router.delete("/deleteLocation/:locationId", deleteLocation);
router.get("/checkLocationExist/:locationName", checkLocationExist);
router.put("/updateLocation/:locationId", updateLocation);

module.exports = router;
