const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config");

//IMPORT ROUTES
const userRoutes = require("./routes/user");
const robotsRoutes = require("./routes/robots");
const tasksRoutes = require("./routes/tasks");
const locationsRoutes = require("./routes/locations");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

const broadcast = (data) => {
  console.log("Broadcasting data:", data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  req.broadcast = broadcast;
  next();
});

app.use("/api", userRoutes);
app.use("/robots", robotsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/locations", locationsRoutes);

app.listen(config.port, () => {
  console.log("Server is running on http://localhost:" + config.port);
});
