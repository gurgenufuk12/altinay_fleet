const Location = require("../models/location");

exports.getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addLocation = async (req, res, next) => {
  try {
    const { locationName, Target,locationDescription } = req.body;
    const location = new Location({
      locationName,
      Target,
      locationDescription,
    });
    await location.save();
    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteLocation = async (req, res, next) => {
  const { locationName } = req.params;
  try {
    const location = await Location.findOneAndDelete({
      locationName: locationName,
    });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ deletedLocation: location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.checkLocationExist = async (req, res) => {
  const { locationName } = req.params;
  try {
    const location = await Location.findOne({ locationName: locationName });
    if (!location) {
      return res.json({ exists: false }); // Location does not exist
    }
    return res.json({ exists: true }); // Location exists
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
