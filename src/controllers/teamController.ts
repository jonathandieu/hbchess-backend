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

      // Check for friend email validation?
      if (recipient) {
        const senderU = sender.username;
        const recieverU = recipient.username;
        const teamExists: ITeam | null = await Team.findOne({
          senderU,
          recieverU
        });
        if (!teamExists) {
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
        }
      } else {
        res.status(400);
        throw new Error("Username doesn't exist");
      }
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }
    // Send me either my_id and the other persons username
    // checkning for an error for the save operation.

    // search api for getting id
    // sender.id and a reciever.id
  }
);

export const getTeam = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.body;

  const team: ITeam | null = await Team.findOne({ _id }).select("-_id");

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
