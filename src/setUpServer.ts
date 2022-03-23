import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware";
const app = express();
import "dotenv/config";
import userRoutes from "./routes/userRoutes";

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
