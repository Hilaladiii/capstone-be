import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
