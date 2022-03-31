import { createServer } from "http";
import socket from "./socket/index";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware";

export const app = express();
export const httpServer = createServer(app);
socket(httpServer);

import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);

app.use(errorHandler);
