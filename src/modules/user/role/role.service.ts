import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '@prisma/client';
import { Role as RoleEnum } from 'src/commons/types/role.type';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async create({ role_name }: CreateRoleDto): Promise<Role> {
    const role = await this.prismaService.role.findFirst({
      where: {
        role_name,
      },
    });

    if (role?.role_name) throw new BadRequestException('Role already exists');

    return await this.prismaService.role.create({
      data: {
        role_name,
      },
    });
  }

  async getRoleByName(role_name: RoleEnum) {
    const roles = await this.prismaService.role.findMany();
    return roles.find((role) => role.role_name === role_name);
  }
}
