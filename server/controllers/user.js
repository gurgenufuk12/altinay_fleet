const firebase = require("../db");
const User = require("../models/user");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("users");

exports.changeUserRole = async (req, res, next) => {
  const { userUid } = req.params;
  const { newRole } = req.body;
  try {
    const userRef = db.doc(userUid.trim());
    await userRef.update({
      userRole: newRole,
    });
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res, next) => {
  const { userUid } = req.params;
  try {
    const userRef = db.doc(userUid.trim());
    await userRef.delete();
    await auth.deleteUser(userUid);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {}
};
