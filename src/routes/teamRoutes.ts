import express from "express";
import { createTeam, getTeam, acceptTeam } from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/get", getTeam);
router.put("/accept", protect, acceptTeam);

export default router;
