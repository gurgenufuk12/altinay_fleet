const firebase = require("../db");
const Robot = require("../models/robot");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("robots");
const robotService = require("../services/robotService");

exports.addRobot = async (req, res, next) => {
  try {
    console.log(req.body.robotId);
    await robotService.addRobot(req.body);
    res.status(200).json({
      success: true,
      message: `Robot with ID ${req.body.robotId} added successfully`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addTarget = async (req, res, next) => {
  try {
    await robotService.addTarget(req.body);
    res.status(200).json({
      success: true,
      message: `Targets added successfully to robot with ID ${req.body.robotId}`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
