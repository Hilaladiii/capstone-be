import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { LogbookService } from './logbook.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { JwtGuard } from 'src/providers/guards/jwt.guard';
import { RoleGuard } from 'src/providers/guards/role.guard';
import { Roles } from 'src/commons/decorators/role.decorator';
import { Role } from 'src/commons/types/role.type';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { UpdateLogbookDto } from './dto/update-logbook.dto';

@Controller('logbook')
export class LogbookController {
  constructor(private logbookService: LogbookService) {}

  @Post('create')
  @Message('Success create logbook')
  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createLogbookDto: CreateLogbookDto,
    @GetCurrentUser('nim') nim: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.logbookService.create(
      nim,
      createLogbookDto.description,
      file,
      file.originalname,
    );
  }

  @Get('student')
  @Message('Success get student logbooks')
  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  async getStudentLogbooks(@GetCurrentUser('nim') nim: string) {
    return await this.logbookService.getStudentLogbooks(nim);
  }

  @Get('lecturer')
  @Message('Success get student logbooks')
  @Roles(Role.LECTURER)
  @UseGuards(JwtGuard, RoleGuard)
  async getSupervisorStudentLogbooks(@GetCurrentUser('nip') nip: string) {
    return await this.logbookService.getSupervisorStudentLogbooks(nip);
  }

  @Delete('delete/:id')
  @Message('Success delete logbook')
  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  async delete(@Param('id') id: string) {
    return await this.logbookService.delete(id);
  }

  @Put('update/:id')
  @Message('Success udpate logbook')
  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateLogbookDto: UpdateLogbookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.logbookService.update(id, updateLogbookDto, file);
  }
}
