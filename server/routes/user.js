const express = require("express");
const { get } = require("mongoose");

const { changeUserRole } = require("../controllers/user");
const { deleteUser } = require("../controllers/user");

const router = express.Router();

router.put("/changeUserRole/:userUid", changeUserRole);
router.delete("/deleteUser/:userUid", deleteUser);

module.exports = router;
