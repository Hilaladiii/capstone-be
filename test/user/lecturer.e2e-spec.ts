import { INestApplication } from '@nestjs/common';
import { createTestApp } from 'test/setup.e2e';
import * as request from 'supertest';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LECTURER_TEST_PAYLOAD, loginHelper } from 'test/helper';
import { LecturerType, StudentType } from 'src/commons/types/user.type';
import { JwtService } from '@nestjs/jwt';
import { JwtLecturerClaim } from 'src/commons/types/jwt.type';

describe('Lecturer e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let headLecturerToken: string;
  let lecturer: JwtLecturerClaim;
  let student: StudentType;
  let studentToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    prismaService = app.get(PrismaService);
    jwtService = app.get(JwtService);

    const resHeadLecturer = await loginHelper(app, {
      email: 'dosen@gmail.com',
      password: 'dosen123',
    });

    headLecturerToken = resHeadLecturer.body.data.token;
    const decodedTokenLecturer = await jwtService.verify(headLecturerToken);

    lecturer = decodedTokenLecturer as JwtLecturerClaim;

    const resStudent = await loginHelper(app, {
      email: 'student@gmail.com',
      password: 'student123',
    });

    studentToken = resStudent.body.data.token;

    student = await prismaService.user.findFirst({
      include: {
        student: true,
      },
    });
  });

  afterAll(async () => {
    await prismaService.student.update({
      where: {
        userId: student.userId,
      },
      data: {
        lecturer: {
          disconnect: {
            nip: lecturer.nip,
          },
        },
      },
    });
    await prismaService.user.delete({
      where: {
        email: LECTURER_TEST_PAYLOAD.email,
      },
    });
    await app.close();
  });

  describe('/user/lecturer/register (POST)', () => {
    it('should register lecturer successfully ', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/lecturer/register')
        .send(LECTURER_TEST_PAYLOAD);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        'message',
        'Success register your account',
      );
      expect(res.body).toHaveProperty('data');
    });

    it('should return 400 if user is already registered ', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/lecturer/register')
        .send(LECTURER_TEST_PAYLOAD);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 if there is a mandatory field that is empty (email)', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/lecturer/register')
        .send({ ...LECTURER_TEST_PAYLOAD, email: undefined });

      expect(res.status).toBe(400);
      expect(res.body.message).toContainEqual('email must be an email');
      expect(res.body.message).toContainEqual('email should not be empty');
    });
  });

  describe('/user/lecturer/student/:nim/supervisor (POST)', () => {
    it('should connect student with supervisor successfully', async () => {
      const res = await request(app.getHttpServer())
        .post(`/user/lecturer/student/${student.student.nim}/supervisor`)
        .set('Authorization', `Bearer ${headLecturerToken}`)
        .send({
          nip: lecturer.nip,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        'message',
        'Success connect supervisor with student',
      );
      expect(res.body).toHaveProperty('data');
    });

    it('should return 403 if not head lecturer', async () => {
      const res = await request(app.getHttpServer())
        .post(`/user/lecturer/student/${student.student.nim}/supervisor`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          nip: lecturer.nip,
        });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
    });

    it('should return 404 if student or lecturer not registered', async () => {
      const res = await request(app.getHttpServer())
        .post(`/user/lecturer/student/${student.student.nim}/supervisor`)
        .set('Authorization', `Bearer ${headLecturerToken}`)
        .send({
          nip: '1234567890',
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        'message',
        'Student or lecturer not found',
      );
    });
  });
});
