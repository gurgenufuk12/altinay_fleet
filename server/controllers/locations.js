const locationService = require("../services/locationService");

exports.addLocation = async (req, res, next) => {
  try {
    const { locationName, Target, locationDescription, locationId } = req.body;

    if (!locationId || locationId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Location ID is required",
      });
    }

    await locationService.addLocation({
      locationId,
      locationName,
      Target,
      locationDescription,
    });

    res.status(200).json({
      success: true,
      message: `Location with ID ${locationId} added successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLocation = async (req, res, next) => {
  const { locationId } = req.params;
  try {
    await locationService.deleteLocation(locationId);

    res.status(200).json({
      success: true,
      message: `Location with ID ${locationId} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkLocationExist = async (req, res) => {
  const { locationName } = req.params;
  try {
    const { locationExists, locationData } =
      await locationService.checkLocationExist(locationName);

    res.status(200).json({
      success: true,
      locationExists: locationExists,
      locationData: locationData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLocation = async (req, res, next) => {
  const { locationId } = req.params;
  const data = req.body;

  try {
    await locationService.updateLocation(locationId, data);

    res.status(200).json({
      success: true,
      message: `Location with ID ${locationId} updated successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
