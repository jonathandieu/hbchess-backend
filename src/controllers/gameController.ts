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
        $or: [{ sender: user._id }, { recipient: user._id }]
      });

      await Promise.all(
        teams.map(async (team) => {
          const games: IGame[] = await Game.find({
            $and: [
              { result: { $eq: null } },
              { $or: [{ white: team._id }, { black: team._id }] }
            ]
          })
            .populate({
              path: "black",
              populate: [
                { path: "sender", select: "_id username" },
                { path: "recipient", select: "_id username" }
              ]
            })
            .populate({
              path: "white",
              populate: [
                { path: "sender", select: "_id username" },
                { path: "recipient", select: "_id username" }
              ]
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

    const white: ITeam | null = await Team.findById(whiteId)
      .populate({ path: "sender", select: "_id username" })
      .populate({ path: "recipient", select: "_id username" });
    const black: ITeam | null = await Team.findById(blackId)
      .populate({ path: "sender", select: "_id username" })
      .populate({ path: "recipient", select: "_id username" });

    if (
      white?.sender._id === black?.sender._id ||
      white?.sender._id === black?.recipient._id ||
      white?.recipient._id === black?.sender._id ||
      white?.recipient._id === black?.recipient._id
    ) {
      res.status(403);
      throw new Error("User cannot play on opposing teams");
    }

    const gameExists = await Game.findOne({
      $and: [
        { result: { $eq: null } },
        { $or: [{ white: white?._id }, { black: black?._id }] }
      ]
    });

    if (gameExists) {
      res.status(409);
      throw new Error("Game already exists");
    }

    const isWhiteSenderHand = Math.random() < 0.5;
    const isBlackSenderHand = Math.random() < 0.5;

    const game: IGame = new Game({
      white: white?._id,
      black: black?._id,
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

    await game.populate({
      path: "black",
      populate: [
        { path: "sender", select: "_id username" },
        { path: "recipient", select: "_id username" }
      ]
    });
    await game.populate({
      path: "white",
      populate: [
        { path: "sender", select: "_id username" },
        { path: "recipient", select: "_id username" }
      ]
    });

    res.status(201).json({ message: "Game created", game });
  }
);

export const saveGame = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { white, black, winner, gameId, moves } = req.body;

    const teamWhite: ITeam | null = await Team.findOne({
      _id: white
    });

    const teamBlack: ITeam | null = await Team.findOne({
      _id: black
    });

    if (teamWhite && teamBlack) {
      const game: IGame | null = await Game.findOne({
        _id: gameId
      });

      if (!game) throw new Error("Game does not exists!");

      if (game.result) throw new Error("Game has already ended!");

      game.moves = moves;
      game.result = winner;

      let err = game.validateSync();
      if (err) {
        const message = err.toString().split(":")[2].trim();
        res.status(400);
        throw new Error(message);
      } else {
        await game.save();
      }

      if (winner === "White") {
        teamWhite.wins.unshift(game._id);
        teamBlack.losses.unshift(game._id);
      } else if (winner === "Black") {
        teamWhite.losses.unshift(game._id);
        teamBlack.wins.unshift(game._id);
      } else {
        teamWhite.ties.unshift(game._id);
        teamBlack.ties.unshift(game._id);
      }

      teamWhite.matches.unshift(game._id);
      teamBlack.matches.unshift(game._id);

      err = teamWhite.validateSync();
      err = teamBlack.validateSync();
      if (err) {
        const message = err.toString().split(":")[2].trim();
        res.status(400);
        throw new Error(message);
      } else {
        await teamWhite.save();
        await teamBlack.save();
      }

      res.status(200);
      res.json({ message: "Game Successfully Saved" });
    }
  }
);

export const getFinishedGames = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { user } = req;
    let allGames: IGame[] = [];

    if (user !== undefined) {
      const teams: ITeam[] = await Team.find({
        $or: [{ sender: user._id }, { recipient: user._id }]
      });

      await Promise.all(
        teams.map(async (team) => {
          const games: IGame[] = await Game.find({
            $and: [
              { result: { $ne: null } },
              { $or: [{ white: team._id }, { black: team._id }] }
            ]
          })
            .sort({ updatedAt: "desc" })
            .limit(5)
            .populate({
              path: "black",
              populate: [
                { path: "sender", select: "_id username" },
                { path: "recipient", select: "_id username" }
              ]
            })
            .populate({
              path: "white",
              populate: [
                { path: "sender", select: "_id username" },
                { path: "recipient", select: "_id username" }
              ]
            });
          if (games) {
            allGames = [...allGames, ...games];
          }
        })
      );

      if (allGames.length !== 0) {
        res.status(200);
        res.json(allGames);
      } else res.status(204).json([]);
    } else {
      res.status(401);
      throw new Error("Invalid token");
    }
  }
);
