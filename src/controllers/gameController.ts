import { Response } from "express";
import { RequestWithUser } from "../middlewares/authMiddleware";
import asyncHandler from "express-async-handler";
import Game, { IGame } from "../models/game";
import Team, { ITeam } from "../models/team";

export const getGames = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const games: IGame[] = await Game.find();
    res.send(games);
  }
);

export const createGame = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { hostTeamId, guestTeamId } = req.body;

    const hostTeam: ITeam | null = await Team.findById(hostTeamId);
    const guestTeam: ITeam | null = await Team.findById(guestTeamId);

    const game: IGame = new Game({ hostTeam, guestTeam });

    await game.save();

    res.send(game);
  }
);
