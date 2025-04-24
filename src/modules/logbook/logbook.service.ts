import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LogbookService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(nim: string, description: string, image: Express.Multer.File) {
    const { publicUrl } = await this.supabaseService.upload(image, 'logbook');

    return await this.prismaService.logbook.create({
      data: {
        description,
        imageUrl: publicUrl,
        student: {
          connect: {
            nim,
          },
        },
      },
    });
  }
}
