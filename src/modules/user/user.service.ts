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
    user_id,
  }: ChangePasswordDto & {
    user_id: string;
  }) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    if (password !== confirmPassword)
      throw new BadRequestException(
        'Password must match with confirm password',
      );

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.prismaService.user.update({
      where: { user_id },
      data: {
        password: hashedPassword,
      },
    });
  }
}
