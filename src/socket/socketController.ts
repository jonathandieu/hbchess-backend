import { verifyToken } from "./../middlewares/authMiddleware";
import { Server } from "socket.io";
import http from "http";
import "dotenv/config";
import consola from "consola";

class Game {
  userIds: Array<string>;
  playerTurn: number;
  moves: Array<string>;

  constructor() {
    this.userIds = [];
    this.playerTurn = 0;
    this.moves = [];
  }
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
        const game = new Game();
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
