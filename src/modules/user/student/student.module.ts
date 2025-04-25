import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
