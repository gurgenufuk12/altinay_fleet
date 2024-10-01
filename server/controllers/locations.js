const firebase = require("../db");
const Location = require("../models/location");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("locations");

exports.addLocation = async (req, res, next) => {
  try {
    const { locationName, Target, locationDescription, locationId } = req.body;
    if (!locationId || locationId.trim() === "") {
      throw new Error("locationId is required and cannot be empty");
    }
    const locationRef = db.doc(locationId.trim());
    await locationRef.set({
      locationId: locationId,
      locationName: locationName,
      locationDescription: locationDescription,
      Target: Target,
    });
    res.status(200).json({
      success: true,
      message: "Location added successfully",
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
  const { locationName } = req.params;
  try {
    const locationRef = db.doc(locationName.trim());
    await locationRef.delete();
    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
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
    const locations = await db.get();
    let locationExists = false;
    let locationData;
    locations.forEach((doc) => {
      if (doc.data().locationName === locationName) {
        locationExists = true;
        locationData = doc.data();
      }
    });
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
