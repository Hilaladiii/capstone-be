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

    return await this.prismaService.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: createStudentDto.email,
          username: createStudentDto.username,
          fullname: createStudentDto.fullname,
          password: hashedPassword,
        },
      });

      const newStudent = await tx.student.create({
        data: {
          nim: createStudentDto.nim,
          sks: createStudentDto.sks,
          year: createStudentDto.year,
          user: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });

      const roleStudent = await this.roleService.getRoleByName(Role.STUDENT);

      await tx.userRole.create({
        data: {
          user_id: newUser.user_id,
          role_id: roleStudent.role_id,
        },
      });

      return {
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        nim: newStudent.nim,
        sks: newStudent.sks,
        year: newStudent.year,
      };
    });
  }
}
