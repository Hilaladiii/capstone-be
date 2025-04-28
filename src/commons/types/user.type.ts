import { Prisma } from '@prisma/client';

export type StudentType = Prisma.UserGetPayload<{
  include: { student: true };
}>;

export type LecturerType = Prisma.UserGetPayload<{
  include: { lecturer: true };
}>;

export type AcademicType = Prisma.UserGetPayload<{
  include: { academic: true };
}>;
