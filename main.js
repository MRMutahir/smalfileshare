const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the uuid package
const app = express();
const server = http.createServer(app);
const status = require("express-status-monitor");
const path = require("path");
const io = socketIO(server);
app.set("view engine", "ejs");
const port = 3001;

app.use(express.static(__dirname + "/public")); // Serve static files
app.use(status());
// User management
const users = {};

// Socket.IO logic for real-time communication
io.on("connection", (socket) => {
  console.log("A user connected");

  // Assign a unique ID to the user using uuid
  const userId = uuidv4();
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

// Serve the main HTML file using streaming
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  const fileStream = fs.createReadStream(indexPath);

  // Pipe the file stream to the response stream
  fileStream.pipe(res);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
