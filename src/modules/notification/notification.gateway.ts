import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/providers/guards/ws-jwt.guard';

@WebSocketGateway(8000, {
  cors: {
    credentials: true,
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  constructor(private notificationService: NotificationService) {}

  @SubscribeMessage('broadcast-announcements')
  @UseGuards(WsJwtGuard)
  async handleMessage(client: Socket, payload: any) {
    try {
      const annoucements = await this.notificationService.sendAnnouncement();

      this.server.emit('announcements', annoucements);
    } catch (error) {
      client.emit('error', { message: 'Failed to broadcast announcements' });
      return { status: 'error', message: error.message };
    }
  }
}
