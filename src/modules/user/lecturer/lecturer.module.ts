import { Module } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [LecturerService],
  controllers: [LecturerController],
})
export class LecturerModule {}
