import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/user";
import mongoose from "mongoose";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user: IUser = new User({
    email,
    username,
    password: hashedPassword,
    emailToken: crypto.randomBytes(64).toString("hex")
  });

  const err = user.validateSync();
  if (err) {
    res.status(400);
    const message = err.toString().split(":")[2].trim();
    throw new Error(message);
  } else {
    await user.save();
  }

  if (user) {
    const url =
      process.env.NODE_ENV === "production"
        ? `https://hbchess.app/api/users/verify-user?emailToken=${user.emailToken}`
        : `http://localhost:${
            process.env.PORT || 8080
          }/api/users/verify-user?emailToken=${user.emailToken}`;
    const msg = {
      to: user.email,
      from: `${process.env.SEND_GRID_SENDER}`,
      subject: `Thank you for registering ${user.username}`,
      text: `
        Thank you for registering ${user.username}.
        Please copy and paste the address below to verify your account.
        ${url}     
      `,
      html: `
        <h1> Thank you for registering ${user.username}.</h1>
        <p>Please click the link below to verify your account.</a>
        <a href="${url}">Verify your account</a>
      `
    };
    sgMail.send(msg);

    res.status(201).json({
      message: "Account Successfully Created"
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { emailToken } = req.query;
  const user: IUser | null = await User.findOne({ emailToken });

  if (user) {
    user.emailToken = "";
    user.isVerified = true;
    await user.save();
    res.redirect(
      process.env.NODE_ENV === "production"
        ? `https://hbchess.app/auth/login`
        : `http://localhost:${process.env.CLIENT_PORT || 3000}`
    );
  } else {
    res.status(400);
    throw new Error("The provided token is invalid");
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
