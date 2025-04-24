import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { AcademicModule } from './academic/academic.module';
import { RoleModule } from './role/role.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [StudentModule, LecturerModule, AcademicModule, RoleModule],
})
export class UserModule {}
