/* eslint-disable no-console */

import express from "express";
const app = express();
import "dotenv/config";

import connectDB from "./db";
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

connectDB();

// Define route handler for the default home page
app.get("/api", (req, res) => {
  res.send("Woooohooo we're setting stuff up!");
});

app.get("/api/testendpoint", (req, res) => {
  res.json({
    message: "Woooohooo we're setting stuff up AND our endpoint works!",
    status: 418,
    testing: "TESTING! (With TypeScript & Automatic Deployment)",
  });
});

// Start express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
