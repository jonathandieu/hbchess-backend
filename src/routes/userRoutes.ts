import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  getUser,
  searchUser
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-user", protect, verifyUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);
router.get("/search", protect, searchUser);

export default router;
