import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [AcademicService],
  controllers: [AcademicController],
})
export class AcademicModule {}
