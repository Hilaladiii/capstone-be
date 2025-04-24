import { Body, Controller, Post } from '@nestjs/common';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { LecturerService } from './lecturer.service';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user/lecturer')
export class LecturerController {
  constructor(private lecturerService: LecturerService) {}

  @Post('register')
  @Message('Success register your account')
  async create(@Body() createLecturerDto: CreateLecturerDto) {
    return await this.lecturerService.create(createLecturerDto);
  }
}
