import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async changePassword({
    password,
    confirmPassword,
    userId,
  }: ChangePasswordDto & {
    userId: string;
  }) {
    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!user) throw new NotFoundException('User not found');

    if (password !== confirmPassword)
      throw new BadRequestException(
        'Password must match with confirm password',
      );

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.prismaService.user.update({
      where: { userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async getProfile(userId: string) {
    const roleMapping = {
      student: ['nim', 'sks', 'year'],
      lecturer: ['nip'],
      academic: ['nip'],
    };

    const user = await this.prismaService.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        fullname: true,
        email: true,
        student: {
          select: {
            nim: true,
            sks: true,
            year: true,
          },
        },
        lecturer: {
          select: {
            nip: true,
          },
        },
        academic: {
          select: {
            nip: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid user id');
    }

    const { userId: id, fullname, email } = user;

    for (const role of Object.keys(roleMapping)) {
      if (user[role]) {
        return {
          role,
          userId: id,
          fullname,
          email,
          [role]: user[role],
        };
      }
    }

    throw new BadRequestException('User role not found');
  }

  async updateProfile({
    userId,
    sks,
    year,
    image,
  }: UpdateUserDto & { userId: string; image: Express.Multer.File }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) throw new BadRequestException('Invalid user id');

    let updateProfileImageUrl = null;
    if (image) {
      const { fileUrl } = await this.supabaseService.upload(image, 'user');
      updateProfileImageUrl = fileUrl;
    }

    await this.prismaService.user.update({
      data: {
        profileImageUrl: updateProfileImageUrl,
        student: {
          update: {
            data: {
              sks,
              year,
            },
          },
        },
      },
      where: {
        userId,
      },
    });
  }
}
