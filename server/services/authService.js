const firebase = require("../db");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("users");

async function changeUserRole(userUid, newRole) {
  if (!userUid || !newRole) {
    return res.status(400).json({
      message: "Bad request",
    });
  }
  const userRef = db.doc(userUid.trim());
  await userRef.update({
    userRole: newRole,
  });
}
async function deleteUser(userUid) {
  const userRef = db.doc(userUid.trim());
  await userRef.delete();
  await auth.deleteUser(userUid);
}

module.exports = { changeUserRole, deleteUser };
