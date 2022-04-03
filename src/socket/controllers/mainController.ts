import {
  ConnectedSocket,
  OnConnect,
  SocketController,
  SocketIO
} from "socket-controllers";
import { Socket, Server } from "socket.io";
import consola from "consola";

@SocketController()
export class MainController {
  @OnConnect()
  connection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
    consola.log("New Socket connected: ", socket.id);

    socket.on("request_games", (callback) => {
      callback(
        Array.from(io.sockets.adapter.rooms)
          .filter((r) => r[0].length === 5)
          .map((r) => {
            return [r[0], [...r[1]]];
          })
      );
    });
  }
}
