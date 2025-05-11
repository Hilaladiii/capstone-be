import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { LecturerService } from './lecturer.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { Role } from 'src/commons/types/role.type';
import { ConnectSupervisorDto } from './dto/connect-supervisor.dto';
import { Auth } from 'src/commons/decorators/auth.decorator';

@Controller('user/lecturer')
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

  @Post('register')
  @Message('Success register your account')
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    return await this.lecturerService.create(createLecturerDto);
  }

  @Post('student/:nim/supervisor')
  @Message('Success connect supervisor with student')
  @Auth(Role.HEAD_STUDY_PROGRAM)
  async connectSupervisorStudent(
    @Param('nim') nim: string,
    @Body() { nip }: ConnectSupervisorDto,
  ) {
    return await this.lecturerService.connectStudentSupervisor(nip, nim);
  }
}
