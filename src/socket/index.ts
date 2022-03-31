import { verifyToken } from "./../middlewares/authMiddleware";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import http from "http";
import "dotenv/config";

const socket = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    transports: ["websocket"], // To avoid sticky sessions when using multiple servers
    path: "/classic-mode",
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://hbchess.app"
          : "http://localhost:3000",
      credentials: true
    }
  });

  try {
    const pubClient = createClient({
      url: process.env.REDIS_URI
    });
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  } catch (err) {
    console.log(err);
  }

  const classicMode = io.of("/classic-mode");
  classicMode.use(verifySocket).on("connection", async (socket) => {
    console.log("TEST");
    setTimeout(() => {
      socket.emit("PING");
    }, 2000);

    socket.on("disconnect", () => {
      console.log("Disconnect");
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
