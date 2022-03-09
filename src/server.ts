/* eslint-disable no-console */

import express from "express";
const app = express();
import "dotenv/config";
import userRoutes from "./routes/userRoutes";

import connectDB from "./db";
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

connectDB();

app.use("/api/users", userRoutes);

// Start express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
