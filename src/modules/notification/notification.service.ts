import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { Announcement } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private notificationGateway: NotificationGateway) {}

  async broadcastAnnouncement(announcement: Announcement) {
    this.notificationGateway.server.emit('announcement', announcement);
  }

  async sendNotificationToStudent<T>(data: T & { nim: string }) {
    this.notificationGateway.server
      .to(`student_${data.nim}`)
      .emit('notification:new', data);
  }
}
