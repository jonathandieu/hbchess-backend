import express from "express";
import { loginUser, registerUser } from "../controllers/userController";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
