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
import { JwtCoreService } from '../jwt-core/jwt-core.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtCoreService: JwtCoreService,
  ) {}

  async login({ email, nip, nim, password }: LoginDto): Promise<string> {
    const userInput = this.checkInputLoginCondition(email, nim, nip);
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: userInput,
      },
      include: {
        roles: {
          select: {
            roleName: true,
          },
        },
        student: {
          select: {
            nim: true,
          },
        },
        academic: {
          select: {
            nip: true,
          },
        },
        lecturer: {
          select: {
            nip: true,
          },
        },
      },
    });

    if (!user) throw new BadRequestException('User not registered');

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch)
      throw new BadRequestException('Email or password invalid!');

    const roles = user.roles.map(
      ({ roleName }) => Role[roleName as keyof typeof Role],
    );

    const isStudentRole = roles.includes(Role.STUDENT) && user.student?.nim;
    const isAcademicRole = roles.includes(Role.ACADEMIC) && user.academic?.nip;
    const isLecturerRole =
      [Role.HEAD_LECTURER, Role.SUPERVISOR, Role.LECTURER].some((role) =>
        roles.includes(role),
      ) && user.lecturer?.nip;

    if (isStudentRole) {
      const claim: JwtStudentClaim = {
        sub: user.userId,
        roles,
        nim: user.student.nim,
      };
      return this.jwtCoreService.signStudentJwt(claim);
    }

    if (isAcademicRole) {
      const claim: JwtAcademicClaim = {
        sub: user.userId,
        roles,
        nip: user.academic.nip,
      };
      return this.jwtCoreService.signAcademicJwt(claim);
    }

    if (isLecturerRole) {
      const claim: JwtLecturerClaim = {
        sub: user.userId,
        roles,
        nip: user.lecturer.nip,
      };
      return this.jwtCoreService.signLecturerJwt(claim);
    }
  }

  private checkInputLoginCondition(email?: string, nim?: string, nip?: string) {
    const condition = [];
    if (email) condition.push({ email });
    if (nim) condition.push({ student: { nim } });
    if (nip) {
      condition.push({ lecturer: { nip } });
      condition.push({ academic: { nip } });
    }

    if (condition.length == 0)
      throw new BadRequestException('Please provide valid login credentials');

    return condition;
  }
}
