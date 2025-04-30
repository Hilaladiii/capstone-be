import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { Role } from 'src/commons/types/role.type';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { AnnoucementService } from './annoucement.service';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import { Message } from 'src/commons/decorators/message.decorator';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('annoucement')
export class AnnoucementController {
  constructor(private announcementService: AnnoucementService) {}

  @Post()
  @Message('Success create announcement')
  @Auth(Role.ACADEMIC)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async create(
    @GetCurrentUser('nip') nip: string,
    @Body() createAnnnoucementDto: CreateAnnoucementDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const file = files.file?.[0];
    const image = files.image?.[0];
    return await this.announcementService.create({
      ...createAnnnoucementDto,
      nip,
      file,
      image,
    });
  }

  @Put(':id')
  @Message('Success update announcement')
  @Auth(Role.ACADEMIC)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') announcement_id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const file = files.file?.[0];
    const image = files.image?.[0];
    return await this.announcementService.update({
      ...updateAnnouncementDto,
      announcement_id,
      file,
      image,
    });
  }

  @Delete(':id')
  @Message('Success delete announcement')
  @Auth(Role.ACADEMIC)
  async delete(@Param('id') id: string) {
    return await this.announcementService.delete(id);
  }

  @Get()
  @Message('Success get all announcement')
  @Auth()
  async getAll() {
    return await this.announcementService.getAll();
  }

  @Get(':id')
  @Message('Success get single announcement')
  @Auth()
  async getById(@Param('id') id: string) {
    return await this.announcementService.getById(id);
  }
}
