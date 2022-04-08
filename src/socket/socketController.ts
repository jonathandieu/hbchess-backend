import { verifyToken } from "./../middlewares/authMiddleware";
import { Server } from "socket.io";
import http from "http";
import "dotenv/config";
import consola from "consola";

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

  io.on("connection", (socket) => {
    consola.log("New Socket connected: ", socket.id);

    socket.on("join_game", async (message, callback) => {
      consola.log("New User joining room: ", message.roomId);
      const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
      const socketRooms = Array.from(socket.rooms.values()).filter(
        (r) => r !== socket.id
      );

      if (
        socketRooms.length > 0 ||
        (connectedSockets && connectedSockets.size === 4)
      ) {
        callback({ error: "Room is full please choose another room to play!" });
      } else {
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
