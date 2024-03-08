const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must contain at least 8 characters"],
      max: 1024,
    },
    user_Role: {
      type: String,
      required: [true, "User role is required"],
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// get the token
userSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
module.exports = mongoose.model("User", userSchema);
