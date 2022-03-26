import express from "express";
import {
  createTeam,
  getTeam,
  acceptTeam,
  allTeam
} from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/get", protect, getTeam);
router.put("/accept", protect, acceptTeam);
router.get("/all", allTeam);

export default router;
