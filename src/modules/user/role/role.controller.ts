import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create')
  @Message('Success create new role')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }
}
