const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
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

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const url = process.env.MONGO_URI;
const port = process.env.PORT || 8000;

mongoose
  .connect(url, {})
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

// Utility function to broadcast data to all connected clients
const broadcast = (data) => {
  console.log('Broadcasting data:', data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Middleware to attach broadcast function to the request
app.use((req, res, next) => {
  req.broadcast = broadcast;
  next();
});

// Routes Middleware
app.use("/api", userRoutes);
app.use("/admin", adminRoutes);
app.use("/robots", robotsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/locations", locationsRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
