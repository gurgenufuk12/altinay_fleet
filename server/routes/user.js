const express = require("express");
const { signup } = require("../controllers/user");
const { getUsers } = require("../controllers/user");
const { login } = require("../controllers/user");
const { logout } = require("../controllers/user");
const { getUserById } = require("../controllers/user");
const router = express.Router();

router.post("/signup", signup);
router.get("/getUsers", getUsers);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user/:id", getUserById);

module.exports = router;
