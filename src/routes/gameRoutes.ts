import express from "express";
import { getGame, createGame } from "../controllers/gameController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/get", protect, getGame);
router.post("/create", protect, createGame);
export default router;
