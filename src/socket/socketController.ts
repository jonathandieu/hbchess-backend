import { verifyToken } from "./../middlewares/authMiddleware";
import { Server } from "socket.io";
import http from "http";
import { useSocketServer } from "socket-controllers";
import "dotenv/config";
import "reflect-metadata";

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

  useSocketServer(io, { controllers: [__dirname + "/controllers/*.ts"] });

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
