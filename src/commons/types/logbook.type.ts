import { Prisma } from '@prisma/client';

export type LogbookType = Prisma.LogbookGetPayload<{
  include: {
    student: true;
  };
}>;
