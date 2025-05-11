import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketWithUser } from 'src/commons/types/notification.type';
import { JwtCoreService } from '../jwt-core/jwt-core.service';

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
  client: Socket;

  constructor(private jwtCoreService: JwtCoreService) {}

  handleConnection(@ConnectedSocket() client: SocketWithUser) {
    const payload = this.jwtCoreService.verifyClient(client);
    client.user = payload;
    client.join(`student_${client.user.nim}`);
  }

  handleDisconnect(@ConnectedSocket() client: SocketWithUser) {
    const payload = this.jwtCoreService.verifyClient(client);
    client.user = payload;
    client.leave(`student_${client.user.nim}`);
  }
}
