

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const app = express();
const server = http.createServer(app);
const status = require("express-status-monitor");
const path = require("path");
const io = socketIO(server);
app.set("view engine", "ejs");
const port = 3000;

app.use(status());
// User management
const users = {};

// Socket.IO logic for real-time communication
io.on("connection", (socket) => {
  console.log("A user connected");

  // Assign a unique ID to the user
  const userId = generateUserId();
  users[userId] = socket;

  // Send the user ID to the connected client
  socket.emit("userId", userId);

  // Handle file sharing events
  socket.on("file", (data) => {
    const fileName = data.fileName;
    const fileContent = data.fileContent;
    const recipientUserId = data.recipientUserId;

    // Send the file content to the specified recipient
    if (users[recipientUserId]) {
      users[recipientUserId].emit("file", {
        fileName,
        fileContent,
        senderUserId: userId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Remove the user from the user list on disconnect
    delete users[userId];
  });
});
// Serve the main HTML fileF
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Function to generate a unique user ID
function generateUserId() {
  return Math.random().toString(36).substring(10);
}

