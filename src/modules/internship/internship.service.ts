import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipApplicationDto } from './dto/create-internship-application.dto';
import { CreateInternshipExtensionDto } from './dto/create-internship-extension.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateInternshipCancellationDto } from './dto/create-internship-cancellation.dto';
import { DocumentStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class InternshipService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
  ) {}

  async createInternshipApplication({
    name,
    nim,
    email,
    phoneNumber,
    totalSks,
    recipientOfLetter,
    agencyAddress,
    internshipObject,
    nameOfAgency,
    startDate,
    type,
    studyResultCardFile,
  }: CreateInternshipApplicationDto & {
    nim: string;
    studyResultCardFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: studyResultCardUrl } = await this.supabaseService.upload(
      studyResultCardFile,
      'documents',
    );

    const startDateFormat = new Date(startDate);

    return await this.prismaService.document.create({
      data: {
        name,
        email,
        agencyAddress,
        nim,
        nameOfAgency,
        phoneNumber,
        totalSks,
        internshipApplication: {
          create: {
            internshipObject,
            recipientOfLetter,
            startDate: startDateFormat,
            studyResultCardUrl,
            type,
          },
        },
        student: {
          connect: {
            nim,
          },
        },
      },
    });
  }

  async createInternshipExtension({
    startDate,
    submissionDate,
    reasonExtension,
    internshipApplicationFile,
    intershipExtensionFile,
    ...createDocument
  }: CreateInternshipExtensionDto & {
    nim: string;
    internshipApplicationFile: Express.Multer.File;
    intershipExtensionFile: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: createDocument.nim,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: internshipApplicationFileUrl } =
      await this.supabaseService.upload(internshipApplicationFile, 'documents');
    const { publicUrl: internshipExtensionFileUrl } =
      await this.supabaseService.upload(intershipExtensionFile, 'documents');

    return await this.prismaService.document.create({
      data: {
        ...createDocument,
        internshipExtension: {
          create: {
            internshipApplicationFileUrl,
            internshipExtensionFileUrl,
            reasonExtension,
            startDate: new Date(startDate),
            submissionDate: new Date(submissionDate),
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
    recipientOfLetter,
    reasonCancellation,
    supportingDocument,
    ...createDocument
  }: CreateInternshipCancellationDto & {
    nim: string;
    supportingDocument: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim: createDocument.nim,
      },
    });

    if (!student) throw new NotFoundException('student not found');

    const { publicUrl: supportingDocumentUrl } =
      await this.supabaseService.upload(supportingDocument, 'documents');

    return await this.prismaService.document.create({
      data: {
        ...createDocument,
        internshipCancellation: {
          create: {
            reasonCancellation,
            recipientOfLetter,
            supportingDocumentUrl,
          },
        },
        student: {
          connect: {
            nim: createDocument.nim,
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
    if (status === DocumentStatus.FAILED && !rejectionReason)
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
}
