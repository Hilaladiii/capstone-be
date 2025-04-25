import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Message } from 'src/commons/decorators/message.decorator';
import { Roles } from 'src/commons/decorators/role.decorator';
import { Role } from 'src/commons/types/role.type';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { RoleGuard } from 'src/providers/guards/role.guard';

@Controller('user/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create')
  @Message('Success create new role')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }
}
