import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NotificationService } from '../notification/notification.service';
import { DocumentFileType, DocumentStatus } from '@prisma/client';
import { CreateInternshipApplicationCompanyDto } from './dto/create-internship-application-company.dto';
import { CreateInternshipExtensionDto } from './dto/create-internship-extension.dto';
import { CreateInternshipCancellationDto } from './dto/create-internship-cancellation.dto';
import { CreateInternshipApplicationCompetitionDto } from './dto/create-internship-application-competition';
import { UpdateStatusDocumentDto } from './dto/update-status-document.dto';

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

    const studyResultCard = await this.supabaseService.upload(
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
          },
        },
        documentFiles: {
          create: {
            ...studyResultCard,
            type: DocumentFileType.STUDY_RESULT_CARD,
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

    const [studyResultCard, proposalCompetitionSertification] =
      await Promise.all([
        this.supabaseService.upload(studyResultCardFile, 'documents'),
        this.supabaseService.upload(
          proposalCompetitionSertificationFile,
          'documents',
        ),
      ]);

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
          },
        },
        documentFiles: {
          createMany: {
            data: [
              {
                ...studyResultCard,
                type: DocumentFileType.STUDY_RESULT_CARD,
              },
              {
                ...proposalCompetitionSertification,
                type: DocumentFileType.PROPOSAL_COMPETITION_CERTIFICATION,
              },
            ],
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

    const [internshipApplication, internshipExtension] = await Promise.all([
      this.supabaseService.upload(internshipApplicationFile, 'documents'),
      this.supabaseService.upload(intershipExtensionFile, 'documents'),
    ]);

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
          },
        },
        documentFiles: {
          createMany: {
            data: [
              {
                ...internshipApplication,
                type: DocumentFileType.INTERNSHIP_APPLICATION_FILE,
              },
              {
                ...internshipExtension,
                type: DocumentFileType.INTERNSHIP_EXTENSION_FILE,
              },
            ],
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

    const supportingDocument = await this.supabaseService.upload(
      supportingDocumentFile,
      'documents',
    );

    return await this.prismaService.document.create({
      data: {
        ...document,
        internshipCancellation: {
          create: {
            agencyName,
            agencyAddress,
            cancellationReason,
          },
        },
        documentFiles: {
          create: {
            ...supportingDocument,
            type: DocumentFileType.SUPPORTING_DOCUMENT,
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

  async upadateInternshipCompany({
    documentId,
    status,
    rejectionReason,
    letterApprovalSupervisorFile,
    coverLetterFile,
  }: UpdateStatusDocumentDto & {
    documentId: string;
    letterApprovalSupervisorFile: Express.Multer.File;
    coverLetterFile: Express.Multer.File;
  }) {
    const document = await this.getById(documentId);

    await this.rejectDocument({ status, rejectionReason, documentId });

    if (letterApprovalSupervisorFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: letterApprovalSupervisorFile,
        type: DocumentFileType.LETTER_APPROVAL_SUPERVISOR,
        nim: document.studentNim,
      });
    }

    if (coverLetterFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: coverLetterFile,
        type: DocumentFileType.COVER_LETTER,
        nim: document.studentNim,
      });
    }
  }

  async getById(documentId: string) {
    const document = await this.prismaService.document.findUnique({
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

  private async rejectDocument({
    status,
    rejectionReason,
    documentId,
  }: {
    status: string;
    rejectionReason: string;
    documentId: string;
  }) {
    if (status === DocumentStatus.DOCUMENT_REVISION) {
      if (!rejectionReason)
        throw new BadRequestException('Rejection reason must be provided');

      const updatedDocument = await this.prismaService.document.update({
        data: {
          status: DocumentStatus.DOCUMENT_REVISION,
          rejectionReason,
        },
        where: {
          documentId,
        },
      });

      await this.notificationService.sendNotificationToStudent({
        nim: updatedDocument.studentNim,
        title: 'Data not comply with provisions',
        content: updatedDocument.rejectionReason,
      });
    }
  }

  private async replaceDocumentFile({
    documentId,
    file,
    type,
    signed = false,
    nim,
  }: {
    documentId: string;
    file: Express.Multer.File;
    type: DocumentFileType;
    signed?: boolean;
    nim: string;
  }) {
    const existingFile = await this.prismaService.documentFile.findFirst({
      where: {
        documentId,
        type,
      },
    });
    if (existingFile) {
      await Promise.all([
        this.supabaseService.delete(existingFile.originalName, 'documents'),
        this.prismaService.documentFile.delete({
          where: {
            fileId: existingFile.fileId,
          },
        }),
      ]);
    }

    const { fileUrl, originalName } = await this.supabaseService.upload(
      file,
      'documents',
    );

    const document = await this.prismaService.documentFile.create({
      data: {
        documentId,
        fileUrl,
        originalName,
        type,
        signed,
      },
    });

    if (signed) {
      await this.notificationService.sendNotificationToStudent({
        nim,
        title: `Dokumen ${document.type} sudah ditandatangani`,
        content: `Dokumen ${document.type} sudah ditandatangani dan tersedia.`,
        fileUrl: fileUrl,
      });
    }
  }
}
