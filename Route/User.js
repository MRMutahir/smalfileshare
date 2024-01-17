import express from "express";
import { getUser } from "../Controller/User.js";

const app = express.Router();

app.get("/", getUser);

export default app;
