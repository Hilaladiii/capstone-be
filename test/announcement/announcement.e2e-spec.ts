import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ANNOUNCEMENT_TEST_PAYLOAD, loginHelper } from 'test/helper';
import { createTestApp } from 'test/setup.e2e';
import * as request from 'supertest';

describe('Announcement e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let academicToken: string;
  let studentToken: string;
  let annoucement_id: string;

  beforeAll(async () => {
    app = await createTestApp();
    prismaService = app.get(PrismaService);
    const responseAcademicLogin = await loginHelper(app, {
      nip: '',
      password: '',
    });
    academicToken = responseAcademicLogin.body.data.token;

    const responseStudentLogin = await loginHelper(app, {
      nim: '',
      password: '',
    });
    studentToken = responseStudentLogin.body.data.token;
  });

  afterAll(async () => {
    await prismaService.announcement.delete({
      where: {
        annoucement_id,
      },
    });
  });

  describe('/announcement (POST)', () => {
    it('should create announcement successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/announcement')
        .set('Authorization', `Bearer ${academicToken}`)
        .field('title', ANNOUNCEMENT_TEST_PAYLOAD.title)
        .field('content', ANNOUNCEMENT_TEST_PAYLOAD.content)
        .attach('image', ANNOUNCEMENT_TEST_PAYLOAD.image)
        .attach('file', ANNOUNCEMENT_TEST_PAYLOAD.file);

      annoucement_id = res.body.data.annoucement_id;

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Success create announcement');
      expect(res.body).toHaveProperty('data');
    });
  });
});
