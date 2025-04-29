import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/commons/types/role.type';
import { RoleService } from '../role/role.service';

@Injectable()
export class StudentService {
  constructor(
    private prismaService: PrismaService,
    private roleService: RoleService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: createStudentDto.username },
          { email: createStudentDto.email },
        ],
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const existingStudent = await this.prismaService.student.findUnique({
      where: {
        nim: createStudentDto.nim,
      },
    });

    if (existingStudent)
      throw new BadRequestException('Student with this NIM already exists');

    const hashedPassword = await bcryptjs.hash(createStudentDto.password, 10);

    const roleStudent = await this.roleService.getRoleByName(Role.STUDENT);

    const newStudent = await this.prismaService.user.create({
      data: {
        email: createStudentDto.email,
        fullname: createStudentDto.fullname,
        username: createStudentDto.username,
        password: hashedPassword,
        student: {
          create: {
            nim: createStudentDto.nim,
            sks: createStudentDto.sks,
            year: createStudentDto.year,
          },
        },
        userRoles: {
          create: {
            role_id: roleStudent.role_id,
          },
        },
      },
      include: {
        student: true,
      },
    });

    return {
      username: newStudent.username,
      email: newStudent.email,
      fullname: newStudent.fullname,
      nim: newStudent.student.nim,
      sks: newStudent.student.sks,
      year: newStudent.student.year,
    };
  }
}
