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
        const teamExists: ITeam | null = await Team.findOne({
          sender: sender._id,
          recipient: recipient._id
        });

        if (teamExists && teamExists.accepted === false) {
          res.status(400);
          throw new Error("Team request still pending");
        }

        if (teamExists && teamExists.accepted === true) {
          res.status(400);
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
        res.status(400);
        throw new Error("Username doesn't exist");
      }
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }
  }
);

export const acceptTeam = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const recipient: IUser | undefined = req.user;

    if (recipient !== undefined) {
      const { username } = req.body;
      const sender: IUser | null = await User.findOne({ username });

      // Check for friend email validation?
      if (sender) {
        const team: ITeam | null = await Team.findOne({
          sender: sender._id,
          recipient: recipient._id
        });

        if (!team) {
          res.status(400);
          throw new Error("Team request revoked");
        }

        if (team.accepted === true) {
          res.status(400);
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
        res.status(400);
        throw new Error("Username doesn't exist");
      }
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }
  }
);

export const getTeam = asyncHandler(async (req: Request, res: Response) => {
  const { senderU, recipientU } = req.body;

  const sender: IUser | null = await User.findOne({ senderU });
  const recipient: IUser | null = await User.findOne({ recipientU });

  const sid = sender?._id;
  const rid = recipient?._id;

  const team: ITeam | null = await Team.findOne({ sid, rid }).select("-_id");

  if (team) {
    if (team.accepted === true) {
      res.json(team);
    } else {
      res.status(400);
      throw new Error("Team request not accepted");
    }
  } else {
    res.status(400);
    throw new Error("Team not found");
  }
});
