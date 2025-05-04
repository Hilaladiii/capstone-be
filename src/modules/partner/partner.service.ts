import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create({
    name,
    address,
    description,
    partnerUrl,
    logo,
  }: CreatePartnerDto & { logo: Express.Multer.File }) {
    const partner = await this.prismaService.partner.findFirst({
      where: {
        name,
      },
    });

    if (partner) throw new BadRequestException('Partner already exists');

    const { publicUrl: logoUrl } = await this.supabaseService.upload(
      logo,
      'partners',
    );

    return await this.prismaService.partner.create({
      data: {
        name,
        address,
        description,
        partnerUrl,
        logoUrl,
      },
    });
  }

  async getAll() {
    return await this.prismaService.partner.findMany({
      select: {
        partnerId: true,
        name: true,
        description: true,
        logoUrl: true,
      },
    });
  }

  async getById(partnerId: string) {
    const partner = await this.prismaService.partner.findUnique({
      where: {
        partnerId,
      },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    return partner;
  }

  async update({
    name,
    description,
    address,
    partnerId,
    partnerUrl,
    logo,
  }: UpdatePartnerDto & { partnerId: string; logo: Express.Multer.File }) {
    await this.getById(partnerId);

    let updateLogo: any = {};

    if (logo) {
      const { publicUrl } = await this.supabaseService.upload(logo, 'partners');
      updateLogo.logoUrl = publicUrl;
    }

    return await this.prismaService.partner.update({
      data: {
        name,
        description,
        address,
        partnerUrl,
        ...updateLogo,
      },
      where: {
        partnerId,
      },
    });
  }

  async delete(partnerId: string) {
    await this.getById(partnerId);
    return await this.prismaService.partner.delete({
      where: {
        partnerId,
      },
    });
  }
}
