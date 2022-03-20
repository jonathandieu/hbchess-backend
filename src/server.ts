/* eslint-disable no-console */

import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware";
const app = express();
import "dotenv/config";
import userRoutes from "./routes/userRoutes";

import connectDB from "./db";
const port = process.env.PORT || 8080; // Listening port defaults to 8080 if there's no env port

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

// Start express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
