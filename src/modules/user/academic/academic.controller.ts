import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user/academic')
export class AcademicController {
  constructor(private academicService: AcademicService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @Message('Success register your account')
  async create(@Body() createAcademicDto: CreateAcademicDto) {
    return await this.academicService.create(createAcademicDto);
  }
}
