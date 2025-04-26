import { INestApplication } from '@nestjs/common';
import { createTestApp } from 'test/setup.e2e';
import * as request from 'supertest';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { STUDENT_TEST_PAYLOAD } from 'test/helper';

describe('Student e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prismaService = app.get(PrismaService);
  });

  afterAll(async () => {
    await prismaService.user.delete({
      where: {
        email: STUDENT_TEST_PAYLOAD.email,
      },
    });
    await app.close();
  });

  describe('/user/student/register (POST)', () => {
    it('should register student successfully ', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/student/register')
        .send(STUDENT_TEST_PAYLOAD);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        'message',
        'Success register your account',
      );
      expect(res.body).toHaveProperty('data');
    });

    it('should return 400 if user is already registered ', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/student/register')
        .send(STUDENT_TEST_PAYLOAD);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 if there is a mandatory field that is empty (email)', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/student/register')
        .send({ ...STUDENT_TEST_PAYLOAD, email: undefined });

      expect(res.status).toBe(400);
      expect(res.body.message).toContainEqual('email must be an email');
      expect(res.body.message).toContainEqual('email should not be empty');
    });
  });
});
