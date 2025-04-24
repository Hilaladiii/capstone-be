import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  JwtAcademicClaim,
  JwtLecturerClaim,
  JwtPayload,
  JwtStudentClaim,
} from '../types/jwt.type';
import { Role } from '../types/role.type';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!data) {
      if (user.roles.includes(Role.STUDENT)) return user as JwtStudentClaim;
      else if (user.roles.includes(Role.LECTURER))
        return user as JwtLecturerClaim;
      else if (user.roles.includes(Role.ACADEMIC))
        return user as JwtAcademicClaim;

      return user;
    }

    return user[data];
  },
);
