import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { Announcement } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private notificationGateway: NotificationGateway,
    private prismaService: PrismaService,
  ) {}

  async broadcastAnnouncement(announcement: Announcement) {
    const students = await this.prismaService.student.findMany({
      include: {
        user: {
          select: {
            userId: true,
          },
        },
      },
    });

    const notificationAnnouncement =
      await this.prismaService.notification.create({
        data: {
          title: announcement.title,
          content: announcement.content,
          notificationReads: {
            createMany: {
              data: students.map((student) => ({ studentNim: student.nim })),
              skipDuplicates: true,
            },
          },
        },
      });

    this.notificationGateway.server.emit(
      'announcement',
      notificationAnnouncement,
    );
  }

  async sendNotificationToStudent<T>(data: T & { nim: string }) {
    this.notificationGateway.server
      .to(`student_${data.nim}`)
      .emit('notification:new', data);
  }

  async getNotifications(nim: string) {
    const notifications = await this.prismaService.notificationRead.findMany({
      where: {
        studentNim: nim,
      },
      select: {
        notificationId: true,
        notification: {
          select: {
            title: true,
            content: true,
          },
        },
        status: true,
        readAt: true,
      },
    });

    return notifications.map(({ notification, ...rest }) => ({
      title: notification.title,
      content: notification.content,
      ...rest,
    }));
  }

  async readNotifications(nim: string) {
    await this.prismaService.notificationRead.updateMany({
      data: {
        status: 'READ',
        readAt: new Date(),
      },
      where: {
        studentNim: nim,
      },
    });
  }

  async countUnReadNotification(nim: string) {
    return await this.prismaService.notificationRead.count({
      where: {
        AND: [
          {
            studentNim: nim,
          },
          {
            status: 'UNREAD',
          },
        ],
      },
    });
  }
}
