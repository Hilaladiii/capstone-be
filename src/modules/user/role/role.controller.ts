import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Message } from 'src/commons/decorators/message.decorator';
import { Role } from 'src/commons/types/role.type';
import { Auth } from 'src/commons/decorators/auth.decorator';

@Controller('user/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create')
  @Message('Success create new role')
  @Auth(Role.ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }
}
