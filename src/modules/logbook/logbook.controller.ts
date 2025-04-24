import {
  Body,
  Controller,
  Post,
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
    );
  }
}
