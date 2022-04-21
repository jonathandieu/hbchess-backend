import { verifyToken } from "./../middlewares/authMiddleware";
import { Server } from "socket.io";
import http from "http";
import "dotenv/config";
import consola from "consola";

export class SocketGame {
  userIds: Array<string>;
  moves: Array<string>;

  constructor() {
    this.userIds = [];
    this.moves = [];
  }
}

export interface SocketData {
  deltaTime: number;
  turn: string;
}

const socket = async (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://hbchess.app"
          : "http://localhost:3000",
      credentials: true
    }
  });

  io.use(verifySocket);

  const games = new Map();

  io.on("connection", (socket) => {
    consola.log("New Socket connected: ", socket.id);

    socket.on("join_game", async (message, callback) => {
      consola.log("New User joining room: ", message.roomId);
      const socketRooms = Array.from(socket.rooms.values()).filter(
        (r) => r !== socket.id
      );

      if (!games.has(message.roomId)) {
        const game = new SocketGame();
        games.set(message.roomId, game);
      }

      if (socketRooms.length > 0) {
        callback({ error: "Room is full please choose another room to play!" });
      } else {
        await socket.join(message.roomId);
        const game = games.get(message.roomId);

        if (!game.userIds.includes(message.player_id)) {
          game.userIds.push(message.player_id);
        }

        games.set(message.roomId, game);
        socket.nsp.to(message.roomId).emit("player_joined", game.userIds);
        callback("Room successfully joined.");
      }
    });

    socket.on("send_move", async (message) => {
      const { roomId, move } = message;

      const game = games.get(roomId);

      if (game) {
        game.moves.push(move);
        games.set(roomId, game);
      }

      socket.to(roomId).emit("sentMove", move);
    });

    socket.on("pick_piece", async (message) => {
      const { roomId, piece } = message;

      socket.to(roomId).emit("piecePicked", piece);
    });

    socket.on("send_emoji", async (message) => {
      const { roomId, emoji } = message;

      socket.to(roomId).emit("sentEmoji", emoji);
    });

    // socket.on("game_end", async (message) => {
    //   const { roomId, black, white, winner, gameId } = message;

    //   const socketGame: SocketGame | null = games.get(roomId);

    //   if (socketGame) saveGame(socketGame, black, white, winner, gameId);

    //   socket.to(roomId).emit("gameEnd", winner);
    // });
  });

  return io;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const verifySocket = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const decoded = verifyToken(socket.handshake.query.token);
    socket.decoded = decoded;
    next();
  } else {
    next(new Error("Not authorized, no token"));
  }
};

export default socket;
