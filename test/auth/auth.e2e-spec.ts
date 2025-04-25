import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { loginHelper } from './auth.helper';
import { HttpExceptionFilter } from 'src/commons/filters/http-exception.filter';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return token when login successful', async () => {
      const res = await loginHelper(app, {
        email: 'student@gmail.com',
        password: 'student123',
      });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should return 400 when user not registered', async () => {
      const res = await loginHelper(app, {
        email: 'notfound@gmail.com',
        password: 'norfound',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User not registered');
    });

    it('should return 400 when password is wrong', async () => {
      const res = await loginHelper(app, {
        email: 'student@gmail.com',
        password: 'student123123',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email or password invalid!');
    });

    it('should return 400 when password is empty', async () => {
      const res = await loginHelper(app, {
        email: 'student@gmail.com',
        password: '',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('password should not be empty');
    });

    it('should return 400 when all identifiers are missing', async () => {
      const res = await loginHelper(app, {
        password: 'password',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide valid login credentials');
    });
  });
});
