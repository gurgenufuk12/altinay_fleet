const express = require("express");
const { get } = require("mongoose");
const { getAdminUsers } = require("../controllers/admin");
const { adminLogin } = require("../controllers/admin");
const { getUsers } = require("../controllers/admin");
const { changeUserRole } = require("../controllers/admin");

const router = express.Router();

router.post("/adminLogin", adminLogin);
router.get("/getAdminUsers", getAdminUsers);
router.get("/getUsers", getUsers);
router.put("/changeUserRole/:username", changeUserRole);

module.exports = router;
