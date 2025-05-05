import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CreateStudentDto } from 'src/modules/user/student/dto/create-student.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';

export const loginHelper = async (app: INestApplication, payload: LoginDto) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(payload);

  return response;
};

export const registerStudentHelper = async (
  app: INestApplication,
  payload: CreateStudentDto,
) => {
  const response = await request(app.getHttpServer())
    .post('/user/student/register')
    .send(payload);

  return response;
};

export const LECTURER_TEST_PAYLOAD = {
  email: 'lecturerTest@gmail.com',
  username: 'lecturerTest',
  fullname: 'lecturerTest22',
  password: 'lecturerTest123',
  nip: '12877665533221',
};

export const ACADEMIC_TEST_PAYLOAD = {
  email: 'academic@gmail.com',
  username: 'academic',
  fullname: 'academic22',
  password: 'academic123',
  nip: '123465423123',
};

export const STUDENT_TEST_PAYLOAD = {
  email: 'testStudent5@gmail.com',
  username: 'testStudent5',
  fullname: 'testStudentGG5',
  password: 'testStudent124',
  nim: '20011223344025',
  sks: 12,
  year: 2020,
};

export const LOGBOOK_TEST_PAYLOAD = {
  description: 'logbook testing description',
  file: '../assets/imagetest1.jpg',
};

export const ANNOUNCEMENT_TEST_PAYLOAD = {
  title: 'pengumuman testing',
  content: 'isi pengumuman testing',
  image: '../assets/imagetest1.jpg',
  file: '../assets/imagetest2.jpg',
};
