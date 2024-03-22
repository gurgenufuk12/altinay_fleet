const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//IMPORT ROUTES
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const robotsRoutes = require("./routes/robots");
const tasksRoutes = require("./routes/tasks");
const locationsRoutes = require("./routes/locations");

const url = process.env.MONGO_URI;
const port = process.env.PORT || 8000;

mongoose
  .connect(url, {})
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//ROUTES MIDDLEWARE
app.use("/api", userRoutes);
app.use("/admin", adminRoutes);
app.use("/robots", robotsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/locations", locationsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
