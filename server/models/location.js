const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema({
  Position: {
    x: String,
    y: String,
    z: String,
  },
  Orientation: {
    x: String,
    y: String,
    z: String,
    w: String,
  },
});
const locationSchema = new mongoose.Schema({
  locationName: String,
  locationDescription: String,
  Target: targetSchema,
});
module.exports = mongoose.model("Location", locationSchema);
