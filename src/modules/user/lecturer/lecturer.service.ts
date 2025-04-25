import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/commons/types/role.type';

@Injectable()
export class LecturerService {
  constructor(private prismaService: PrismaService) {}

  async create(createLecturerDto: CreateLecturerDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createLecturerDto.username },
          { email: createLecturerDto.email },
        ],
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const existingLecturer = await this.prismaService.lecturer.findUnique({
      where: {
        nip: createLecturerDto.nip,
      },
    });

    if (existingLecturer)
      throw new BadRequestException('Lectuer with this NIP already exists');

    const hashedPassword = await bcryptjs.hash(createLecturerDto.password, 10);

    return await this.prismaService.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: createLecturerDto.email,
          username: createLecturerDto.username,
          fullname: createLecturerDto.fullname,
          password: hashedPassword,
        },
      });

      const newLecturer = await tx.lecturer.create({
        data: {
          nip: createLecturerDto.nip,
          user: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });

      const roleLecturer = (await tx.role.findMany()).find(
        (role) => role.role_name == Role.LECTURER,
      );

      await tx.userRole.create({
        data: {
          user_id: newUser.user_id,
          role_id: roleLecturer.role_id,
        },
      });

      return {
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        nip: newLecturer.nip,
      };
    });
  }

  async connectStudentSupervisor(nip: string, nim: string) {
    const student = await this.prismaService.student.findUnique({
      where: {
        nim,
      },
      include: {
        lecturer: true,
      },
    });

    if (student?.lecturer.nip === nip)
      throw new BadRequestException(
        'Student already connected with supervisor',
      );

    const lecturer = await this.prismaService.lecturer.findUnique({
      where: {
        nip,
      },
    });

    if (!student?.nim || !lecturer?.nip)
      throw new NotFoundException('Student or lecturer not found');

    return await this.prismaService.student.update({
      where: {
        nim: student.nim,
      },
      data: {
        supervisor_nip: lecturer.nip,
      },
    });
  }
}
