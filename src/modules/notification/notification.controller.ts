import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { Role } from 'src/commons/types/role.type';
import { Message } from 'src/commons/decorators/message.decorator';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @Message('Success get notifications')
  @Auth(Role.STUDENT)
  async getNotifications(@GetCurrentUser('nim') nim: string) {
    return await this.notificationService.getNotifications(nim);
  }

  @Patch('read')
  @Message('Success read notifications')
  @Auth(Role.STUDENT)
  async readNotifications(@GetCurrentUser('nim') nim: string) {
    await this.notificationService.readNotifications(nim);
  }

  @Get('unread-count')
  @Message('Success get total count unread notifications')
  @Auth(Role.STUDENT)
  async countUnReadNotification(@GetCurrentUser('nim') nim: string) {
    return await this.notificationService.countUnReadNotification(nim);
  }
}
