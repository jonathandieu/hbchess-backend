import express from "express";
import { createTeam, getTeam } from "../controllers/teamController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/get", getTeam);

export default router;
