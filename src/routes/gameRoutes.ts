import express from "express";
import { getGame, createGame, saveGame } from "../controllers/gameController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/get", protect, getGame);
router.post("/create", protect, createGame);
router.put("/save", protect, saveGame);
export default router;
