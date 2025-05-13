import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { NotificationService } from '../notification/notification.service';
import { paginationHelper } from 'src/commons/helpers/pagination.helper';

@Injectable()
export class AnnouncementService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
  ) {}

  async create(
    data: CreateAnnoucementDto & {
      nip: string;
      image?: Express.Multer.File;
      file?: Express.Multer.File;
    },
  ) {
    let imageUrl = null;
    let fileUrl = null;

    if (data?.image) {
      const { fileUrl } = await this.supabaseService.upload(
        data.image,
        'announcement-images',
      );
      imageUrl = fileUrl;
    }
    if (data?.file) {
      const { fileUrl: file } = await this.supabaseService.upload(
        data.file,
        'announcement-files',
      );
      fileUrl = file;
    }

    const annoucement = await this.prismaService.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        fileUrl,
        imageUrl,
        academic: {
          connect: {
            nip: data.nip,
          },
        },
      },
    });

    await this.notificationService.broadcastAnnouncement(annoucement);
    return annoucement;
  }

  async update(
    data: UpdateAnnouncementDto & {
      announcement_id: string;
      image?: Express.Multer.File;
      file?: Express.Multer.File;
    },
  ) {
    let urlPaylod: any = {};

    if (data?.image) {
      const { fileUrl } = await this.supabaseService.upload(
        data.image,
        'announcement-images',
      );
      urlPaylod.imageUrl = fileUrl;
    }
    if (data?.file) {
      const { fileUrl } = await this.supabaseService.upload(
        data.file,
        'announcement-files',
      );
      urlPaylod.fileUrl = fileUrl;
    }

    return await this.prismaService.announcement.update({
      data: {
        title: data.title,
        content: data.content,
        updated_at: new Date(),
        ...urlPaylod,
      },
      where: {
        announcementId: data.announcement_id,
      },
    });
  }

  async delete(announcementId: string) {
    const announcement = await this.prismaService.announcement.findUnique({
      where: {
        announcementId,
      },
    });

    if (!announcement) throw new NotFoundException('Annoucement not found');

    return await this.prismaService.announcement.delete({
      where: {
        announcementId,
      },
    });
  }

  async getAll({
    currPage,
    dataPerPage,
    title = '',
    orderBy = 'asc',
  }: {
    currPage?: number;
    dataPerPage?: number;
    title?: string;
    orderBy?: 'asc' | 'desc';
  }) {
    const whereOption = {
      title: {
        contains: title,
      },
    };
    const totalAnnouncements = await this.prismaService.announcement.count({
      where: whereOption,
    });
    const { offset, totalCount, totalPage } = paginationHelper(
      currPage,
      dataPerPage,
      totalAnnouncements,
    );

    const announcements = await this.prismaService.announcement.findMany({
      skip: offset,
      take: dataPerPage,
      select: {
        announcementId: true,
        title: true,
        createdAt: true,
      },
      where: whereOption,
      orderBy: {
        createdAt: orderBy,
      },
    });

    return {
      announcements,
      totalCount,
      totalPage,
    };
  }

  async getById(announcementId: string) {
    const announcement = await this.prismaService.announcement.findUnique({
      where: {
        announcementId,
      },
    });

    if (!announcement) throw new NotFoundException('Annoucement not found');

    return announcement;
  }
}
