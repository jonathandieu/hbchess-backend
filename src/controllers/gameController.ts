import { Response } from "express";
import { RequestWithUser } from "../middlewares/authMiddleware";
import asyncHandler from "express-async-handler";
import Game, { IGame } from "../models/game";
import Team, { ITeam } from "../models/team";

export const getGame = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = req.user;
    let allGames: IGame[] = [];

    if (user !== undefined) {
      const teams: ITeam[] = await Team.find({
        $or: [{ sender: user }, { recipient: user }]
      });

      await Promise.all(
        teams.map(async (team) => {
          const games: IGame[] = await Game.find({
            $or: [{ white: team }, { black: team }]
          });
          if (games) {
            allGames = [...allGames, ...games];
          }
        })
      );
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }

    if (allGames) {
      res.status(200);
      res.json(allGames);
    } else res.status(204).json([]);
  }
);

export const createGame = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { whiteId, blackId } = req.body;
    const { user } = req;

    const white: ITeam | null = await Team.findById(whiteId);
    const black: ITeam | null = await Team.findById(blackId);

    if (
      white?.sender === black?.sender ||
      white?.sender === black?.recipient ||
      white?.recipient === black?.sender ||
      white?.recipient === black?.recipient
    ) {
      res.status(403);
      throw new Error("User cannot play on opposing teams");
    }

    const gameExists = await Game.findOne({
      $or: [
        { white: white, black: black },
        { white: black, black: white }
      ]
    });

    if (gameExists) {
      res.status(409);
      throw new Error("Game already exists");
    }

    const isWhiteSenderHand = Math.random() < 0.5;
    const isBlackSenderHand = Math.random() < 0.5;

    const game: IGame = new Game({
      white,
      black,
      isWhiteSenderHand,
      isBlackSenderHand
    });

    const err = game.validateSync();
    if (err) {
      res.status(400);
      const message = err.toString().split(":")[2].trim();
      throw new Error(message);
    } else {
      await game.save();
    }

    res.status(201).json({ message: "Game created", game });
  }
);
