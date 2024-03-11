const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.adminLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username, user_Role: "admin" });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "You are not an admin user",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Your password is incorrect",
      });

    generateToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const generateToken = async (user, statusCode, res) => {
  const token = user.jwtGenerateToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ user_Role: "admin" });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.changeUserRole = async (req, res, next) => {
  const { username } = req.params;
  const { newRole } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username: username },
      { user_Role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ updatedUser: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
