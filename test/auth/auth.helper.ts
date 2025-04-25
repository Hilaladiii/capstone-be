import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const loginHelper = async (
  app: INestApplication,
  payload: {
    email?: string;
    nim?: string;
    nip?: string;
    password: string;
  },
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(payload);

  return response;
};
