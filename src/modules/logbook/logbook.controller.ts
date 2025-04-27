import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { Role } from 'src/commons/types/role.type';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Auth } from 'src/commons/decorators/auth.decorator';

@Controller('logbook')
export class LogbookController {
  constructor(private logbookService: LogbookService) {}

  @Post('create')
  @Message('Success create logbook')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createLogbookDto: CreateLogbookDto,
    @GetCurrentUser('nim') nim: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return await this.logbookService.create(
      nim,
      createLogbookDto.description,
      file,
    );
  }

  @Get('student')
  @Message('Success get student logbooks')
  @Auth(Role.STUDENT)
  async getStudentLogbooks(@GetCurrentUser('nim') nim: string) {
    return await this.logbookService.getStudentLogbooks(nim);
  }

  @Get('lecturer')
  @Message('Success get student logbooks')
  @Auth(Role.LECTURER)
  async getSupervisorStudentLogbooks(@GetCurrentUser('nip') nip: string) {
    return await this.logbookService.getSupervisorStudentLogbooks(nip);
  }

  @Delete('delete/:id')
  @Message('Success delete logbook')
  @Auth(Role.STUDENT)
  async delete(@Param('id') id: string) {
    return await this.logbookService.delete(id);
  }

  @Put('update/:id')
  @Message('Success update logbook')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateLogbookDto: UpdateLogbookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!updateLogbookDto?.description && !file)
      throw new BadRequestException('Description or file must be provided');
    return await this.logbookService.update(id, updateLogbookDto, file);
  }
}
