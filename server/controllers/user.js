const firebase = require("../db");
const User = require("../models/user");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("users");
const authService = require("../services/authService");

exports.changeUserRole = async (req, res, next) => {
  const { userUid } = req.params;
  const { newRole } = req.body;
  try {
    await authService.changeUserRole(userUid, newRole);
    res.status(200).json({
      success: true,
      message: `User role updated for UserId: ${userUid} `,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res, next) => {
  const { userUid } = req.params;
  try {
    await authService.deleteUser(userUid);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
