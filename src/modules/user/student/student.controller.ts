import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('register')
  @Message('Success register your account')
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }
}
