import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [SupabaseModule, NotificationModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
