import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded: JwtPayload | string = jwt.verify(
          token,
          `${process.env.JWT_SECRET}`
        );

        if (!(typeof decoded === "string")) {
          req.user = await User.findById(decoded.jti).select("-password");
          next();
        } else {
          // Throws an error based on the message from jwt.verify
          res.status(401);
          throw new Error(decoded);
        }
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
