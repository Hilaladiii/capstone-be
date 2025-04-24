import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/commons/types/role.type';

@Injectable()
export class AcademicService {
  constructor(private prismaService: PrismaService) {}

  async create(createAcademicDto: CreateAcademicDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createAcademicDto.username },
          { email: createAcademicDto.email },
        ],
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const existingAcademic = await this.prismaService.lecturer.findUnique({
      where: {
        nip: createAcademicDto.nip,
      },
    });

    if (existingAcademic)
      throw new BadRequestException('Academic with this NIP already exists');

    const hashedPassword = await bcryptjs.hash(createAcademicDto.password, 10);

    return await this.prismaService.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: createAcademicDto.email,
          username: createAcademicDto.username,
          fullname: createAcademicDto.fullname,
          password: hashedPassword,
        },
      });

      const newAcademic = await tx.academic.create({
        data: {
          nip: createAcademicDto.nip,
          user: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });

      const roleAcademic = (await tx.role.findMany()).find(
        (role) => role.role_name == Role.ACADEMIC,
      );

      await tx.userRole.create({
        data: {
          user_id: newUser.user_id,
          role_id: roleAcademic.role_id,
        },
      });

      return {
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        nip: newAcademic.nip,
      };
    });
  }
}
