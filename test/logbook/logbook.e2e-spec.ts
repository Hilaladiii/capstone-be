import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LOGBOOK_TEST_PAYLOAD, loginHelper } from 'test/helper';
import { createTestApp } from 'test/setup.e2e';
import * as request from 'supertest';
import * as path from 'path';

describe('Logbook e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let studentToken: string;
  let lecturerToken: string;
  let logbook_id: string;

  beforeAll(async () => {
    app = await createTestApp();
    prismaService = app.get(PrismaService);
    const responseStudentLogin = await loginHelper(app, {
      email: 'testing@gmail.com',
      password: 'testing123123',
    });
    studentToken = responseStudentLogin.body.data.token;

    const responseLecturerLogin = await loginHelper(app, {
      email: 'dosen@gmail.com',
      password: 'dosen123',
    });

    lecturerToken = responseLecturerLogin.body.data.token;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/logbook/${logbook_id}`)
      .set('Authorization', `Bearer ${studentToken}`);
  });

  describe('/logbook (POST)', () => {
    it('should create logbook successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/logbook')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', LOGBOOK_TEST_PAYLOAD.description)
        .attach('file', path.join(__dirname, LOGBOOK_TEST_PAYLOAD.file));

      logbook_id = res.body.data.logbook_id;

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Success create logbook');
      expect(res.body).toHaveProperty('data');
    });

    it('should return 403 if not students who make logbooks', async () => {
      const res = await request(app.getHttpServer())
        .post('/logbook')
        .set('Authorization', `Bearer ${lecturerToken}`)
        .field('description', LOGBOOK_TEST_PAYLOAD.description)
        .attach('file', path.join(__dirname, LOGBOOK_TEST_PAYLOAD.file));

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
      expect(res.body).toHaveProperty('error', 'Forbidden');
    });

    it('should return 400 if the description is empty', async () => {
      const res = await request(app.getHttpServer())
        .post('/logbook')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', '')
        .attach('file', path.join(__dirname, LOGBOOK_TEST_PAYLOAD.file));

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'message',
        'description should not be empty',
      );
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 400 if the file is empty', async () => {
      const res = await request(app.getHttpServer())
        .post('/logbook')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', LOGBOOK_TEST_PAYLOAD.description)
        .attach('file', null);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'File is required');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('/logbook/:id (DELETE)', () => {
    it('should delete logbook successfully', async () => {
      const resCreate = await request(app.getHttpServer())
        .post('/logbook')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', 'logbook test delete')
        .attach('file', path.join(__dirname, '../assets/imagetest2.jpg'));
      const res = await request(app.getHttpServer())
        .delete(`/logbook/${resCreate.body.data.logbook_id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Success delete logbook');
      expect(res.body).toHaveProperty('data');
    });

    it('should return 404 if logbook_id is invalid or not filled in', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/logbook/123`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'logbook not found');
      expect(res.body).toHaveProperty('error');
    });

    it('should return 403 if not students', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/logbook/123`)
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('/logbook/:id (PUT)', () => {
    it('should update logbook successfully', async () => {
      const res = await request(app.getHttpServer())
        .put(`/logbook/${logbook_id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', 'logbook test update')
        .attach('file', path.join(__dirname, '../assets/imagetest2.jpg'));

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Success update logbook');
      expect(res.body).toHaveProperty('data');
    });

    it('should return 403 if not students who make logbooks', async () => {
      const res = await request(app.getHttpServer())
        .put(`/logbook/${logbook_id}`)
        .set('Authorization', `Bearer ${lecturerToken}`)
        .field('description', 'logbook test update')
        .attach('file', path.join(__dirname, '../assets/imagetest2.jpg'));

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
      expect(res.body).toHaveProperty('error', 'Forbidden');
    });

    it('should return 404 if logbook_id is invalid or not filled in', async () => {
      const res = await request(app.getHttpServer())
        .put(`/logbook/123`)
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', 'logbook test update')
        .attach('file', path.join(__dirname, '../assets/imagetest2.jpg'));
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'logbook not found');
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if the description and file is empty', async () => {
      const res = await request(app.getHttpServer())
        .put(`/logbook/${logbook_id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .field('description', '')
        .attach('file', null);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'message',
        'Description or file must be provided',
      );
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('/logbook/student (GET)', () => {
    it('should return student logbooks successfully', async () => {
      const res = await request(app.getHttpServer())
        .get('/logbook/student')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'message',
        'Success get student logbooks',
      );
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return 403 if not student', async () => {
      const res = await request(app.getHttpServer())
        .get('/logbook/student')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
      expect(res.body).toHaveProperty('error', 'Forbidden');
    });
  });

  describe('/logbook/lecturer (GET)', () => {
    it('should return student logbooks successfully', async () => {
      const res = await request(app.getHttpServer())
        .get('/logbook/lecturer')
        .set('Authorization', `Bearer ${lecturerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        'message',
        'Success get student logbooks',
      );
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return 403 if not lecturer', async () => {
      const res = await request(app.getHttpServer())
        .get('/logbook/lecturer')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message', 'Forbidden resource');
      expect(res.body).toHaveProperty('error', 'Forbidden');
    });
  });
});
