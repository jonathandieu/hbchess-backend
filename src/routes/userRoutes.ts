import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser
} from "../controllers/userController";
const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-user", verifyUser);
router.post("/login", loginUser);

export default router;
