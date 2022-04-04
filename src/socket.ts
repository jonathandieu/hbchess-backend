import { Server, Socket } from "socket.io";
import { createServer } from "http";
import app from "./server";
import mongoose from "mongoose";

export interface ListenEvents {
  move: (move: string) => void;
}

export interface EmitEvents {
  update: (move: string, turn: string) => void;
}

export interface ServerSideEvents {
  ping: () => void;
}

export interface SocketData {
  white: mongoose.Types.ObjectId;
  whiteBrain: mongoose.Types.ObjectId;
  whiteHand: mongoose.Types.ObjectId;
  black: mongoose.Types.ObjectId;
  blackBrain: mongoose.Types.ObjectId;
  blackHand: mongoose.Types.ObjectId;
  turn: mongoose.Types.ObjectId;
  hash: string;
}

export const io = new Server<ListenEvents, EmitEvents, ServerSideEvents, SocketData>(l, e, s, d);

export function createSocket(server: Server) {
  const server = createServer(app);

  io.on("connection", (socket: Socket<ListenEvents, EmitEvents, ServerSideEvents, SocketData>) => {
    socket.on("move", () => {
      // ...
    });

    io.to("room1");
  });
  server.listen(3000);
}
