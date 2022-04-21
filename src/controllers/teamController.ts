import { Request, Response } from "express";
import { RequestWithUser } from "../middlewares/authMiddleware";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/user";
import Team, { ITeam } from "../models/team";

export const createTeam = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const sender: IUser | undefined = req.user;

    if (sender !== undefined) {
      const { username } = req.body;
      const recipient: IUser | null = await User.findOne({ username });

      if (recipient) {
        if (recipient.isVerified === false) {
          res.status(401);
          throw new Error("Recipient not verified");
        }

        const teamExists: ITeam | null = await Team.findOne({
          $or: [
            { sender: sender._id, recipient: recipient._id },
            { sender: recipient._id, recipient: sender._id }
          ]
        });

        if (teamExists && teamExists.accepted === false) {
          res.status(409);
          throw new Error("Team request still pending");
        }

        if (teamExists && teamExists.accepted === true) {
          res.status(409);
          throw new Error("Team already exists");
        }

        const team: ITeam = new Team({
          sender: sender._id,
          recipient: recipient._id
        });

        const err = team.validateSync();
        if (err) {
          res.status(400);
          const message = err.toString().split(":")[2].trim();
          throw new Error(message);
        } else {
          await team.save();
        }
      } else {
        res.status(404);
        throw new Error("Username doesn't exist");
      }
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }

    res.status(201).json({
      message: "Team invite sent"
    });
  }
);

export const getTeam = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { user } = req;

    if (user) {
      const team = await Team.find({
        $or: [{ sender: user._id }, { recipient: user._id }],
        accepted: true
      })
        .sort({ wins: "desc" })
        .populate({ path: "sender", select: "_id username" })
        .populate({ path: "recipient", select: "_id username" });

      const teamNot = await Team.find({
        $or: [{ sender: user._id }, { recipient: user._id }],
        accepted: false
      })
        .sort({ wins: "desc" })
        .populate({ path: "sender", select: "_id username" })
        .populate({ path: "recipient", select: "_id username" });

      if (team || teamNot) {
        res.status(200).json({ team, teamNot });
      } else {
        res.status(204).json();
      }
    } else {
      res.status(401);
      throw new Error("Invalid Token");
    }
  }
);

export const acceptTeam = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const recipient: IUser | undefined = req.user;

    if (recipient !== undefined) {
      const { username } = req.body;
      const sender: IUser | null = await User.findOne({ username });

      if (sender) {
        const team: ITeam | null = await Team.findOne({
          sender: sender._id,
          recipient: recipient._id
        });

        if (!team) {
          res.status(409);
          throw new Error("Team request revoked");
        }

        if (team.accepted === true) {
          res.status(409);
          throw new Error("Already a team");
        }

        team.accepted = true;

        const err = team.validateSync();
        if (err) {
          res.status(400);
          const message = err.toString().split(":")[2].trim();
          throw new Error(message);
        } else {
          await team.save();
        }
      } else {
        res.status(404);
        throw new Error("Username doesn't exist");
      }
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }
    res.status(201).json({
      message: "Team invite accepted"
    });
  }
);

export const allTeam = asyncHandler(async (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  if (limit !== undefined && offset !== undefined) {
    const team = await Team.find({ accepted: true })
      .sort({ wins: "desc" })
      .skip(+offset)
      .limit(+limit)
      .populate({ path: "sender", select: "_id username" })
      .populate({ path: "recipient", select: "_id username" });

    if (team) res.status(200).json(team);
    else res.status(204).json();
  } else {
    res.status(400);
    throw new Error("Provide limit and/or offset");
  }
});
