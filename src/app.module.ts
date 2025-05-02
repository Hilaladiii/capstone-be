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
import { NotificationGateway } from './modules/notification/notification.gateway';
import { NotificationModule } from './modules/notification/notification.module';

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
