import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  JwtAcademicClaim,
  JwtLecturerClaim,
  JwtStudentClaim,
} from 'src/commons/types/jwt.type';
import { Role } from 'src/commons/types/role.type';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
        student: true,
        academic: true,
        lecturer: true,
      },
    });

    if (!user) throw new BadRequestException('User not registered');

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch)
      throw new BadRequestException('Email or password invalid!');

    const roles = user.userRoles.map(
      ({ role }) => Role[role.role_name as keyof typeof Role],
    );

    const isStudentRole = roles.includes(Role.STUDENT) && user.student?.nim;
    const isAcademicRole = roles.includes(Role.ACADEMIC) && user.academic?.nip;
    const isLecturerRole =
      [Role.HEAD_LECTURER, Role.SUPERVISOR, Role.LECTURER].some((role) =>
        roles.includes(role),
      ) && user.lecturer?.nip;

    if (isStudentRole) {
      const claim: JwtStudentClaim = {
        sub: user.user_id,
        roles,
        nim: user.student.nim,
      };
      return this.signStudentJwt(claim);
    }

    if (isAcademicRole) {
      const claim: JwtAcademicClaim = {
        sub: user.user_id,
        roles,
        nip: user.academic.nip,
      };
      return this.signAcademicJwt(claim);
    }

    if (isLecturerRole) {
      const claim: JwtLecturerClaim = {
        sub: user.user_id,
        roles,
        nip: user.lecturer.nip,
      };
      return this.signLecturerJwt(claim);
    }
  }

  async signStudentJwt(claim: JwtStudentClaim) {
    return this.jwtService.sign(claim);
  }

  async signLecturerJwt(claim: JwtLecturerClaim) {
    return this.jwtService.sign(claim);
  }

  async signAcademicJwt(claim: JwtAcademicClaim) {
    return this.jwtService.sign(claim);
  }
}
