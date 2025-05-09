import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogbookModule } from './modules/logbook/logbook.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { NotificationModule } from './modules/notification/notification.module';
import { InternshipModule } from './modules/internship/internship.module';
import { PartnerModule } from './modules/partner/partner.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { JwtCoreModule } from './modules/jwt-core/jwt-core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 20,
        },
      ],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    LogbookModule,
    SupabaseModule,
    AnnouncementModule,
    NotificationModule,
    InternshipModule,
    PartnerModule,
    ConsultationModule,
    JwtCoreModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
