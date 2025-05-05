import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { Role } from 'src/commons/types/role.type';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateFeedbackConsultationDto } from './dto/create-feedback-consultation.dto';

@Controller('consultation')
export class ConsultationController {
  constructor(private consultationService: ConsultationService) {}

  @Post()
  @Message('Success create consultation')
  @Auth(Role.STUDENT)
  async create(
    @GetCurrentUser('nim') nim: string,
    @Body() createConsultationDto: CreateConsultationDto,
  ) {
    return await this.consultationService.create({
      ...createConsultationDto,
      nim,
    });
  }

  @Patch(':id')
  @Message('Success send feedback consultation')
  @Auth(Role.HEAD_LECTURER)
  async sendFeedbackConsulation(
    @Param('id') consultationId: string,
    @Body() createFeedbackConsultationDto: CreateFeedbackConsultationDto,
  ) {
    return await this.consultationService.sendFeedbackConsultation({
      ...createFeedbackConsultationDto,
      consultationId,
    });
  }

  @Get('student')
  @Message('Success get student consulatation')
  @Auth(Role.STUDENT)
  async getStudentConsultation(@GetCurrentUser('nim') nim: string) {
    return await this.consultationService.getStudentConsultations(nim);
  }

  @Get('head-lecturer')
  @Message('Success get student consulatation')
  @Auth(Role.HEAD_LECTURER)
  async getHeadLecturerConsultation(@GetCurrentUser('nip') nip: string) {
    return await this.consultationService.getHeadLecturerConsultations(nip);
  }
}
