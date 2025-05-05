import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/commons/types/role.type';
import { RoleService } from '../role/role.service';

@Injectable()
export class AcademicService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}

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

    const roleAcademic = await this.roleService.getRoleByName(Role.ACADEMIC);

    const newAcademic = await this.prismaService.user.create({
      data: {
        email: createAcademicDto.email,
        fullname: createAcademicDto.fullname,
        username: createAcademicDto.username,
        password: hashedPassword,
        academic: {
          create: {
            nip: createAcademicDto.nip,
          },
        },
        roles: {
          connect: {
            roleId: roleAcademic.roleId,
          },
        },
      },
      include: {
        academic: true,
      },
    });

    return {
      username: newAcademic.username,
      email: newAcademic.email,
      fullname: newAcademic.fullname,
      nip: newAcademic.academic.nip,
    };
  }
}
