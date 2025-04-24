import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { LecturerService } from './lecturer.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { Roles } from 'src/commons/decorators/role.decorator';
import { Role } from 'src/commons/types/role.type';
import { RoleGuard } from 'src/providers/guards/role.guard';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';

@Controller('user/lecturer')
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

  @Post('register')
  @Message('Success register your account')
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    return await this.lecturerService.create(createLecturerDto);
  }

  @Post('connect-student/:nim')
  @Message('Success connect supervisor with student')
  @Roles(Role.LECTURER)
  @UseGuards(JwtGuard, RoleGuard)
  async connectSupervisorStudent(
    @Param('nim') nim: string,
    @GetCurrentUser('nip') nip: string,
  ) {
    console.log(nim);
    console.log(nip);
    return await this.lecturerService.connectStudentSupervisor(nip, nim);
  }
}
