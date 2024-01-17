// import express from "express";
// import http from "http";
// import { v4 } from "uuid";
// import "dotenv/config";
// import mongoose from "mongoose";
// import { User } from "./Shema/User.js";

// const app = express();
// const server = http.createServer(app);
// const uuid = v4();
// let clientAddress;
// let clientPort;
// let clientId;

// app.use(async (req, res, next) => {
//   clientAddress = req.connection.remoteAddress;
//   clientPort = req.connection.remotePort;
//   clientId = uuid;

//   const user = new User({
//     clientAddress: clientAddress,
//     clientPort: clientPort,
//     clientId: clientId,
//   });

//   await user.save();
//   res.status(201).json({
//     message: "User created successfully",
//     clientID: `youe client Id is that ${clientId}`,
//   });

//   // const existingUser = await User.findOne({
//   //   clientAddress: clientAddress,
//   // });

//   // if (existingUser) {
//   //   return res.status(409).json({
//   //     message: "User with the same client information already exists",
//   //   });
//   // } else {
//   //   const user = new User({
//   //     clientAddress: clientAddress,
//   //     clientPort: clientPort,
//   //     clientId: clientId,
//   //   });

//   //   await user.save();
//   //   res.status(201).json({
//   //     message: "User created successfully",
//   //     clientID: `youe client Id is that ${clientId}`,
//   //   });
//   // }

//   // res.locals.clientId = clientId;
//   next();
// });

// const connection = async () => {
//   await mongoose.connect(process.env.MONGOURL, {});
//   console.log("mongodb connect");
// };

// app.get("/", async (req, res) => {
//   const existingUser = await User.findOne({
//     clientAddress: clientAddress,
//   });

//   if (existingUser) {
//     return res.status(409).json({
//       message: "User with the same client information already exists",
//     });
//   }
// });

// // Handle server errors
// server.on("error", (err) => {
//   console.error("Server error:", err.message);
// });

// // Start the server on a specific port
// const PORT = 3000;
// server.listen(PORT, () => {
//   connection();
//   console.log(`Server listening on port ${PORT}`);
// });

import express from "express";
import http from "http";
import { v4 as uuid } from "uuid";
import approute from "./Route/User.js";
import "dotenv/config";
import mongoose from "mongoose";
import { User } from "./Shema/User.js";

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Middleware to handle user creation
app.use("/api/user", approute);

const connect = () => {
  mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
      console.log("connect to DB");
    })
    .catch((error) => {
      throw error;
    });
};


app.use(async (req, res, next) => {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const randomAlphabets = Array.from(
    { length: 4 },
    () => alphabets[Math.floor(Math.random() * alphabets.length)]
  );
  const randomNumber = Math.floor(Math.random() * 10);
  // console.log(randomNumber);

  const clientAddress = req.connection.remoteAddress;
  const clientPort = req.connection.remotePort;
  const clientId = `${randomAlphabets.join("")}${randomNumber}`;

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGOURL, {});
    const existingUser = await User.findOne({ clientAddress });
    if (existingUser) {
      return res.status(409).json({
        message: "User with the same client information already exists",
      });
    }

    const user = new User({
      clientAddress,
      clientPort,
      clientId,
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      clientID: `your client Id is ${clientId}`,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err.message);
});

// Start the server
server.listen(PORT, () => {
  connect();
  console.log(`Server listening on port ${PORT}`);
});
