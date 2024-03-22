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
    const { locationName, Target } = req.body;
    const location = new Location({
      locationName,
      Target,
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
