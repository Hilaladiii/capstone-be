import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateFeedbackConsultationDto } from './dto/create-feedback-consultation.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ConsultationService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(data: CreateConsultationDto & { nim: string }) {
    return await this.prismaService.consultation.create({
      data: {
        ...data,
        student: {
          connect: {
            nim: data.nim,
          },
        },
      },
    });
  }

  async sendFeedbackConsultation({
    consultationId,
    ...data
  }: CreateFeedbackConsultationDto & { consultationId: string }) {
    await this.getById(consultationId);
    const consultation = await this.prismaService.consultation.update({
      data: {
        ...data,
      },
      where: {
        consultationId,
      },
    });
    await this.notificationService.sendNotificationToStudent({
      nim: consultation.studentNim,
      title: consultation.position,
      content: consultation.note,
    });
    return consultation;
  }

  async getById(consultationId: string) {
    const consultation = await this.prismaService.consultation.findUnique({
      where: {
        consultationId,
      },
    });

    if (!consultationId) throw new NotFoundException('Consultation not found');

    return consultation;
  }

  async getStudentConsultations(nim: string) {
    return await this.prismaService.consultation.findMany({
      where: {
        student: {
          nim,
        },
      },
    });
  }

  async getHeadLecturerConsultations(nip: string) {
    return await this.prismaService.consultation.findMany();
  }
}
