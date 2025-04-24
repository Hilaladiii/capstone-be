import { RoleType } from './role.type';

export type JwtPayload = {
  sub: string;
  roles: RoleType['roles'];
};

export type JwtStudentClaim = JwtPayload & {
  nim: string;
};

export type JwtLecturerClaim = JwtPayload & {
  nip: string;
};

export type JwtAcademicClaim = JwtPayload & {
  nip: string;
};
