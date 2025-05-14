import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook } from '@prisma/client';
import { CreateFeedbackLogbookDto } from './dto/create-feedback-logbook.dto';
import { CreateLogbookDto } from './dto/create-logbook.dto';

@Injectable()
export class LogbookService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create({
    nim,
    file,
    date,
    ...rest
  }: CreateLogbookDto & {
    nim: string;
    file: Express.Multer.File;
  }) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim,
      },
    });

    if (!student)
      throw new BadRequestException('Student with this nim not registered');

    const { fileUrl } = await this.supabaseService.upload(file, 'logbook');

    return await this.prismaService.logbook.create({
      data: {
        date: new Date(date),
        fileOriginalName: file.originalname,
        fileUrl,
        ...rest,
        student: {
          connect: {
            nim,
          },
        },
      },
    });
  }

  async update(
    logbookId: string,
    updateLogbookDto: UpdateLogbookDto,
    file?: Express.Multer.File,
  ) {
    const logbook = await this.prismaService.logbook.findUnique({
      where: {
        logbookId,
      },
    });

    if (!logbook) throw new NotFoundException('logbook not found');

    let fileData: any = {};
    if (file) {
      await this.supabaseService.delete(logbook.fileOriginalName, 'logbook');
      const { fileUrl } = await this.supabaseService.upload(file, 'logbook');
      fileData.fileUrl = fileUrl;
      fileData.fileOriginalName = file.originalname;
    }

    return await this.prismaService.logbook.update({
      where: {
        logbookId,
      },
      data: {
        ...updateLogbookDto,
        ...fileData,
      },
    });
  }

  async delete(logbookId: string) {
    const logbook = await this.prismaService.logbook.findUnique({
      where: {
        logbookId,
      },
    });

    if (!logbook) throw new NotFoundException('logbook not found');

    await this.supabaseService.delete(logbook.fileOriginalName, 'logbook');
    return await this.prismaService.logbook.delete({
      where: {
        logbookId,
      },
    });
  }

  async getStudentLogbooks(nim: string): Promise<Logbook[]> {
    const logbooks = await this.prismaService.logbook.findMany({
      where: {
        student: {
          nim,
        },
      },
    });

    if (logbooks.length === 0)
      throw new NotFoundException('logbooks not found');

    return logbooks;
  }

  async getSupervisorStudentLogbooks(nip: string): Promise<Logbook[]> {
    const logbooks = await this.prismaService.logbook.findMany({
      where: {
        student: {
          lecturer: {
            nip,
          },
        },
      },
    });

    if (logbooks.length === 0)
      throw new NotFoundException('logbooks not found');

    return logbooks;
  }

  async getById(logbookId: string) {
    const logbook = await this.prismaService.logbook.findUnique({
      where: {
        logbookId,
      },
    });

    if (!logbook) throw new NotFoundException('Logbook not found');
    return logbook;
  }

  async sendFeedbackLogbook({
    logbookId,
    note,
  }: CreateFeedbackLogbookDto & { logbookId: string }) {
    await this.getById(logbookId);
    return await this.prismaService.logbook.update({
      data: {
        note,
      },
      where: {
        logbookId,
      },
    });
  }
}
