import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/user";
import Team, { ITeam } from "../models/team";

export const createTeam = asyncHandler(async (req, res) => {
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
        const team: ITeam = await Team.create({
          sender: sender._id,
          recipient: recipient._id
        });

        if (!team) {
          res.status(400);
          throw new Error("Error creating team");
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
});

export const getTeam = asyncHandler(async (req, res) => {
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
