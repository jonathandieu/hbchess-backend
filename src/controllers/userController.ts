import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user: IUser = await User.create({
    username,
    email,
    password: hashedPassword
  });

  if (user) {
    res.status(201).json({
      token: generateToken(user._id, user.username, user.email)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user: IUser | null = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isVerified) {
      res.json({
        token: generateToken(user._id, user.username, email)
      });
    } else {
      res.status(400);
      throw new Error("Please check your email");
    }
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const generateToken = (
  id: mongoose.Types.ObjectId,
  username: string,
  email: string
) => {
  return jwt.sign({ id, username, email }, `${process.env.JWT_SECRET}`, {
    expiresIn: "30d"
  });
};
