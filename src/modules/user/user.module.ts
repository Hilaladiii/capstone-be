import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { AcademicModule } from './academic/academic.module';
import { RoleModule } from './role/role.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    StudentModule,
    LecturerModule,
    AcademicModule,
    RoleModule,
    SupabaseModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
