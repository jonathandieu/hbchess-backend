import express from "express";
import {
  getGame,
  createGame,
  saveGame,
  getFinishedGames
} from "../controllers/gameController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/get", protect, getGame);
router.post("/create", protect, createGame);
router.put("/save", protect, saveGame);
router.get("/dashboard", protect, getFinishedGames);
export default router;
