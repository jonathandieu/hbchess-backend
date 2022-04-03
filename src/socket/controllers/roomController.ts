import { Socket, Server } from "socket.io";
import { ConnectedSocket } from "socket-controllers";
import {
  SocketIO,
  SocketController,
  OnMessage,
  MessageBody
} from "socket-controllers";
import consola from "consola";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: { roomId: string }
  ) {
    consola.log("New User joining room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 4)
    ) {
      socket.emit("room_emit_error", {
        error: "Room is full please choose another room to play!"
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined");
    }
  }
}
