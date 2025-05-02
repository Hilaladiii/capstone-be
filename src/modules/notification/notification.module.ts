import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { AnnouncementModule } from '../announcement/announcement.module';

@Module({
  imports: [AnnouncementModule],
  providers: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
