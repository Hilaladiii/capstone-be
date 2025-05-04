import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketWithUser } from 'src/commons/types/notification.type';
import { WsJwtGuard } from 'src/providers/guards/ws-jwt.guard';

@WebSocketGateway(8000, {
  cors: {
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-student-room')
  @UseGuards(WsJwtGuard)
  handleJoinRoom(@ConnectedSocket() client: SocketWithUser) {
    client.join(`student_${client.user.nim}`);
    client.emit('joined-room', { success: true });
  }

  handleConnection(client: any, ...args: any[]) {}
  handleDisconnect(client: any) {}
}
