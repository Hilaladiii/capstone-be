import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../types/role.type';
import { Roles } from './role.decorator';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { RoleGuard } from 'src/providers/guards/role.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtGuard, RoleGuard));
}
