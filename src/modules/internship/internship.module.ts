import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [SupabaseModule, NotificationModule],
  providers: [InternshipService],
  controllers: [InternshipController],
})
export class InternshipModule {}
