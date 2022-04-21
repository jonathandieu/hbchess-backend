import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  getUser,
  searchUser,
  forgotPasswordUser,
  resetPasswordUser
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-user", verifyUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);
router.get("/search", protect, searchUser);
router.post("/forgotPassword", forgotPasswordUser);
router.put("/resetPassword", resetPasswordUser);

export default router;
