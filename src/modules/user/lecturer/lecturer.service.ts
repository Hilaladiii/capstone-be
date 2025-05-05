import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/commons/types/role.type';
import { RoleService } from '../role/role.service';

@Injectable()
export class LecturerService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}

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

    const roleLecturer = await this.roleService.getRoleByName(Role.LECTURER);

    const newLecturer = await this.prismaService.user.create({
      data: {
        email: createLecturerDto.email,
        fullname: createLecturerDto.fullname,
        username: createLecturerDto.username,
        password: hashedPassword,
        lecturer: {
          create: {
            nip: createLecturerDto.nip,
          },
        },
        roles: {
          connect: {
            roleId: roleLecturer.roleId,
          },
        },
      },
      include: {
        lecturer: true,
      },
    });
    return {
      username: newLecturer.username,
      email: newLecturer.email,
      fullname: newLecturer.fullname,
      nip: newLecturer.lecturer.nip,
    };
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

    if (student?.lecturer?.nip === nip)
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
        supervisorNip: lecturer.nip,
      },
    });
  }
}
