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
import { InternshipType } from 'src/commons/types/internship.type';

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

  async getInternship(type: InternshipType) {
    const include: any = {
      documentFiles: true,
      student: {
        select: {
          nim: true,
          sks: true,
          year: true,
          user: {
            select: {
              email: true,
              fullname: true,
            },
          },
        },
      },
    };

    const where: any = {};

    switch (type) {
      case InternshipType.COMPANY:
        include.internshipApplicationCompany = true;
        where.internshipApplicationCompany = { isNot: null };
        break;
      case InternshipType.COMPETITION:
        include.internshipApplicationCompetition = true;
        where.internshipApplicationCompetition = { isNot: null };
        break;
      case InternshipType.EXTENSION:
        include.internshipExtension = true;
        where.internshipExtension = { isNot: null };
        break;
      case InternshipType.CANCELLATION:
        include.internshipCancellation = true;
        where.internshipCancellation = { isNot: null };
        break;
      default:
        break;
    }

    return this.prismaService.document.findMany({
      where,
      include,
    });
  }

  async updateInternshipCompany({
    documentId,
    status,
    rejectionReason,
    letterApprovalSupervisorFile,
    coverLetterFile,
    studyResultCardFile,
  }: UpdateStatusDocumentDto & {
    documentId: string;
    letterApprovalSupervisorFile: Express.Multer.File;
    coverLetterFile: Express.Multer.File;
    studyResultCardFile: Express.Multer.File;
  }) {
    const document = await this.getById(documentId);
    if (!document?.internshipApplicationCompany) {
      throw new NotFoundException('Document not found');
    }

    await this.rejectDocument({ status, rejectionReason, documentId });

    if (studyResultCardFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: studyResultCardFile,
        type: DocumentFileType.STUDY_RESULT_CARD,
        nim: document.studentNim,
        status,
      });
    }

    if (letterApprovalSupervisorFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: letterApprovalSupervisorFile,
        type: DocumentFileType.LETTER_APPROVAL_SUPERVISOR,
        nim: document.studentNim,
        status,
      });
    }

    if (coverLetterFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: coverLetterFile,
        type: DocumentFileType.COVER_LETTER,
        nim: document.studentNim,
        status,
      });
    }
    await this.updateStatus(documentId, status);
  }

  async updateInternshipCompetition({
    documentId,
    status,
    rejectionReason,
    internshipDeterminationCompetitionLetterFile,
    internshipVerificationCompetitionLetterFile,
    studyResultCardFile,
    proposalCompetitionSertificationFile,
  }: UpdateStatusDocumentDto & {
    documentId: string;
    internshipVerificationCompetitionLetterFile: Express.Multer.File;
    internshipDeterminationCompetitionLetterFile: Express.Multer.File;
    studyResultCardFile: Express.Multer.File;
    proposalCompetitionSertificationFile: Express.Multer.File;
  }) {
    const document = await this.getById(documentId);
    if (!document?.internshipApplicationCompetition) {
      throw new NotFoundException('Document not found');
    }

    await this.rejectDocument({ status, rejectionReason, documentId });

    if (studyResultCardFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: studyResultCardFile,
        type: DocumentFileType.STUDY_RESULT_CARD,
        nim: document.studentNim,
        status,
      });
    }

    if (internshipVerificationCompetitionLetterFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: internshipVerificationCompetitionLetterFile,
        type: DocumentFileType.INTERNSHIP_VERIFICATION_COMPETITION_LETTER,
        nim: document.studentNim,
        status,
      });
    }

    if (internshipDeterminationCompetitionLetterFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: internshipDeterminationCompetitionLetterFile,
        type: DocumentFileType.COVER_LETTER,
        nim: document.studentNim,
        status,
      });
    }

    if (proposalCompetitionSertificationFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: proposalCompetitionSertificationFile,
        type: DocumentFileType.PROPOSAL_COMPETITION_CERTIFICATION,
        nim: document.studentNim,
        status,
      });
    }
    await this.updateStatus(documentId, status);
  }

  async updateInternshipExtension({
    documentId,
    status,
    rejectionReason,
    internshipApplicationFile,
    internshipExtensionFile,
  }: UpdateStatusDocumentDto & {
    documentId: string;
    internshipApplicationFile: Express.Multer.File;
    internshipExtensionFile: Express.Multer.File;
  }) {
    const document = await this.getById(documentId);
    if (!document?.internshipExtension) {
      throw new NotFoundException('Document not found');
    }

    await this.rejectDocument({ status, rejectionReason, documentId });

    if (internshipApplicationFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: internshipApplicationFile,
        type: DocumentFileType.INTERNSHIP_APPLICATION_FILE,
        nim: document.studentNim,
        status,
      });
    }

    if (internshipExtensionFile) {
      return await this.replaceDocumentFile({
        documentId,
        file: internshipExtensionFile,
        type: DocumentFileType.INTERNSHIP_EXTENSION_FILE,
        nim: document.studentNim,
        status,
      });
    }

    await this.updateStatus(documentId, status);
  }

  async updateInternshipCancellation({
    documentId,
    status,
    rejectionReason,
    supportingDocument,
  }: UpdateStatusDocumentDto & {
    documentId: string;
    supportingDocument: Express.Multer.File;
  }) {
    const document = await this.getById(documentId);
    if (!document?.internshipCancellation) {
      throw new NotFoundException('Document not found');
    }

    await this.rejectDocument({ status, rejectionReason, documentId });

    if (supportingDocument) {
      return await this.replaceDocumentFile({
        documentId,
        file: supportingDocument,
        type: DocumentFileType.SUPPORTING_DOCUMENT,
        nim: document.studentNim,
        status,
      });
    }

    await this.updateStatus(documentId, status);
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
        internshipApplicationCompany: {
          select: {
            documentId: true,
          },
        },
        internshipApplicationCompetition: {
          select: {
            documentId: true,
          },
        },
        internshipExtension: {
          select: {
            documentId: true,
          },
        },
        internshipCancellation: {
          select: {
            documentId: true,
          },
        },
      },
    });

    if (!document) throw new NotFoundException('Document not found');

    return document;
  }

  async updateStatus(documentId: string, status: DocumentStatus) {
    await this.getById(documentId);
    await this.prismaService.document.update({
      data: {
        status,
      },
      where: {
        documentId,
      },
    });
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
    status,
  }: {
    documentId: string;
    file: Express.Multer.File;
    type: DocumentFileType;
    signed?: boolean;
    nim: string;
    status: DocumentStatus;
  }) {
    const existingFile = await this.prismaService.documentFile.findFirst({
      where: {
        AND: [{ documentId }, { type }],
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

    const document = await this.prismaService.document.update({
      data: {
        status,
        documentFiles: {
          create: {
            fileUrl,
            originalName,
            type,
            signed,
          },
        },
      },
      where: {
        documentId,
      },
      include: {
        documentFiles: {
          select: {
            originalName: true,
          },
        },
      },
    });

    if (signed) {
      await this.notificationService.sendNotificationToStudent({
        nim,
        title: `Dokumen sudah ditandatangani`,
        content: `Dokumen ${document.documentFiles[0].originalName} sudah ditandatangani dan tersedia.`,
        fileUrl: fileUrl,
      });
    }
  }
}
