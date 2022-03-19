import asyncHandler from "express-async-handler";
import Team, { ITeam } from "../models/team";
import User, { IUser } from "../models/user";
import "dotenv/config";

export const createTeam = asyncHandler(async (req, res) => {
  const user = req.User;
});
