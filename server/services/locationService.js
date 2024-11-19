const firebase = require("../db");
const db = firebase.collection("locations");
const taskService = require("./taskService");

const addLocation = async (locationData) => {
  const { locationId, locationName, locationDescription, Target } =
    locationData;
  const locationRef = db.doc(locationId.trim());
  await locationRef.set({
    locationId,
    locationName,
    locationDescription,
    Target,
  });
};

const deleteLocation = async (locationId) => {
  const locationRef = db.doc(locationId.trim());
  await locationRef.delete();
  await taskService.updateSavedTaskTargetsByLocationId(locationId);
};

const checkLocationExist = async (locationName) => {
  const locations = await db.get();
  let locationExists = false;
  let locationData;

  locations.forEach((doc) => {
    if (doc.data().locationName === locationName) {
      locationExists = true;
      locationData = doc.data();
    }
  });

  return { locationExists, locationData };
};

const updateLocation = async (locationId, data) => {
  const locationRef = db.doc(locationId);
  await locationRef.update({
    locationName: data.locationName,
    locationDescription: data.locationDescription,
  });
};

module.exports = {
  addLocation,
  deleteLocation,
  checkLocationExist,
  updateLocation,
};
