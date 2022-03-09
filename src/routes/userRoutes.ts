import express from "express";
import {
  loginUser,
  registerUser,
  verifyEmail
} from "../controllers/userController";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyEmail", verifyEmail);
router.post("/login", loginUser);

export default router;
