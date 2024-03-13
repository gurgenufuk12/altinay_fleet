const Robot = require("../models/robot");

exports.getRobots = async (req, res, next) => {
  try {
    const robots = await Robot.find();
    res.status(200).json({
      success: true,
      data: robots,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
