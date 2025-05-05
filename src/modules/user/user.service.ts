import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
}
