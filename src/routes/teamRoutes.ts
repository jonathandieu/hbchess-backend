import express from "express";
import {
  createTeam,
  getTeam,
  acceptTeam,
  allTeam,
  getGamesTeam
} from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/get", protect, getTeam);
router.put("/accept", protect, acceptTeam);
router.get("/all", allTeam);
router.get("/dashboard", protect, getGamesTeam);

export default router;
