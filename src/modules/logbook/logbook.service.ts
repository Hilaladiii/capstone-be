import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook } from '@prisma/client';

@Injectable()
export class LogbookService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(nim: string, description: string, image: Express.Multer.File) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim,
      },
    });

    if (!student)
      throw new BadRequestException('Student with this nim not registered');

    const { publicUrl } = await this.supabaseService.upload(image, 'logbook');

    return await this.prismaService.logbook.create({
      data: {
        description,
        imageOriginalName: image.originalname,
        imageUrl: publicUrl,
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

    const updateData: any = {};

    if (updateLogbookDto?.description)
      updateData.description = updateLogbookDto.description;

    if (file) {
      await this.supabaseService.delete(logbook.imageOriginalName, 'logbook');
      const { publicUrl } = await this.supabaseService.upload(file, 'logbook');
      updateData.imageUrl = publicUrl;
      updateData.imageOriginalName = file.originalname;
    }

    updateData.updatedAt = new Date();

    return await this.prismaService.logbook.update({
      where: {
        logbookId,
      },
      data: {
        ...updateData,
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

    await this.supabaseService.delete(logbook.imageOriginalName, 'logbook');
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
}
