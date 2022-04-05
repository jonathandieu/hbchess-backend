import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/user";

export interface RequestWithUser extends Request {
  user?: IUser;
}

export const protect = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization) {
      try {
        token = req.headers.authorization;

        const decoded: JwtPayload | string = verifyToken(token);

        if (!(typeof decoded === "string")) {
          req.user = await User.findById(decoded.id).select("");
          next();
        } else {
          res.status(401);
          throw new Error("Invalid token");
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

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
  return decoded;
};
