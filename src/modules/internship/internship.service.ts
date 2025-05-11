import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipApplicationCompanyDto } from './dto/create-internship-application-company.dto';
import { CreateInternshipExtensionDto } from './dto/create-internship-extension.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateInternshipCancellationDto } from './dto/create-internship-cancellation.dto';
import { DocumentStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { CreateInternshipApplicationCompetitionDto } from './dto/create-internship-application-competition';

@Injectable()
export class InternshipService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
  ) {}

  async createInternshipApplicationCompany({
    totalSks,
    recipientOfLetter,
    agencyAddress,
    internshipObject,
    agencyName,
    startDate,
    finishDate,
    studyResultCardFile,
    studentNimApply,
    ...document
  }: CreateInternshipApplicationCompanyDto & {
    studentNimApply: string;
    studyResultCardFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: studentNimApply,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: studyResultCardUrl } = await this.supabaseService.upload(
      studyResultCardFile,
      'documents',
    );

    return await this.prismaService.document.create({
      data: {
        ...document,
        internshipApplicationCompany: {
          create: {
            agencyName,
            agencyAddress,
            totalSks,
            startDate: new Date(startDate),
            finishDate: new Date(finishDate),
            internshipObject,
            recipientOfLetter,
            studyResultCardUrl,
          },
        },
        student: {
          connect: {
            nim: studentNimApply,
          },
        },
      },
    });
  }

  async createInternshipApplicationCompetition({
    totalSks,
    competitionName,
    competitionSupervisor,
    competitionCategory,
    competitionOrganizer,
    competitionInformation,
    competitionLevel,
    competitionWinner,
    competitionProduct,
    competitionStartDate,
    competitionFinishDate,
    studentNimApply,
    studyResultCardFile,
    proposalCompetitionSertificationFile,
    ...document
  }: CreateInternshipApplicationCompetitionDto & {
    studentNimApply: string;
    studyResultCardFile: Express.Multer.File;
    proposalCompetitionSertificationFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: studentNimApply,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: studyResultCardUrl } = await this.supabaseService.upload(
      studyResultCardFile,
      'documents',
    );

    const { publicUrl: proposalCompetitionSertificationUrl } =
      await this.supabaseService.upload(
        proposalCompetitionSertificationFile,
        'documents',
      );

    return await this.prismaService.document.create({
      data: {
        ...document,
        internshipApplicationCompetition: {
          create: {
            totalSks,
            competitionName,
            competitionSupervisor,
            competitionCategory,
            competitionOrganizer,
            competitionInformation,
            competitionLevel,
            competitionWinner,
            competitionProduct,
            competitionStartDate: new Date(competitionStartDate),
            competitionFinishDate: new Date(competitionFinishDate),
            studyResultCardUrl,
            proposalCompetitionSertificationUrl,
          },
        },
        student: {
          connect: {
            nim: studentNimApply,
          },
        },
      },
    });
  }

  async createInternshipExtension({
    totalSks,
    agencyName,
    agencyAddress,
    startDatePeriod,
    finishDatePeriod,
    startExtensionDatePeriod,
    finishExtensionDatePeriod,
    reasonExtension,
    internshipApplicationFile,
    intershipExtensionFile,
    studentNimApply,
    ...document
  }: CreateInternshipExtensionDto & {
    studentNimApply: string;
    internshipApplicationFile: Express.Multer.File;
    intershipExtensionFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: studentNimApply,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: internshipApplicationFileUrl } =
      await this.supabaseService.upload(internshipApplicationFile, 'documents');
    const { publicUrl: internshipExtensionFileUrl } =
      await this.supabaseService.upload(intershipExtensionFile, 'documents');

    return await this.prismaService.document.create({
      data: {
        ...document,
        internshipExtension: {
          create: {
            totalSks,
            agencyName,
            agencyAddress,
            startDatePeriod: new Date(startDatePeriod),
            finishDatePeriod: new Date(finishDatePeriod),
            startExtensionDatePeriod: new Date(startExtensionDatePeriod),
            finishExtensionDatePeriod: new Date(finishExtensionDatePeriod),
            reasonExtension,
            internshipApplicationFileUrl,
            internshipExtensionFileUrl,
          },
        },
        student: {
          connect: {
            nim: student.nim,
          },
        },
      },
    });
  }

  async createInternshipCancellation({
    agencyName,
    agencyAddress,
    cancellationReason,
    supportingDocumentFile,
    studentNimApply,
    ...document
  }: CreateInternshipCancellationDto & {
    studentNimApply: string;
    supportingDocumentFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: studentNimApply,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: supportingDocumentUrl } =
      await this.supabaseService.upload(supportingDocumentFile, 'documents');

    return await this.prismaService.document.create({
      data: {
        ...document,
        internshipCancellation: {
          create: {
            agencyName,
            agencyAddress,
            cancellationReason,
            supportingDocumentUrl,
          },
        },
        student: {
          connect: {
            nim: studentNimApply,
          },
        },
      },
    });
  }

  async updateStatus({
    status,
    rejectionReason,
    documentId,
  }: {
    status: DocumentStatus;
    rejectionReason?: string;
    documentId: string;
  }) {
    if (status === DocumentStatus.DOCUMENT_REVISION && !rejectionReason)
      throw new BadRequestException('Rejection reason must be provided');

    await this.getById(documentId);
    const document = await this.prismaService.document.update({
      data: {
        status,
        rejectionReason,
      },
      where: {
        documentId,
      },
      include: {
        student: {
          select: {
            nim: true,
          },
        },
      },
    });

    await this.notificationService.sendNotificationToStudent({
      nim: document.student.nim,
    });

    return document;
  }

  async getById(documentId: string) {
    const document = await this.prismaService.document.findUnique({
      where: {
        documentId,
      },
    });

    if (!document) throw new NotFoundException('Document not found');

    return document;
  }

  async getStatus(nim: string) {
    return await this.prismaService.document.findMany({
      where: {
        student: {
          nim,
        },
      },
      select: {
        status: true,
      },
    });
  }
}
