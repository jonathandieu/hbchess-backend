import express from "express";
import { getGames, createGame } from "../controllers/gameController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/get", protect, getGames);
router.post("/create", protect, createGame);
export default router;
