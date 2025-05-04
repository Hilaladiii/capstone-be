import {
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
import { Auth } from 'src/commons/decorators/auth.decorator';
import { Message } from 'src/commons/decorators/message.decorator';
import { Role } from 'src/commons/types/role.type';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PartnerService } from './partner.service';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @Post()
  @Message('Success add partner')
  @Auth(Role.ACADEMIC)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createPartnerDto: CreatePartnerDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return await this.partnerService.create({ ...createPartnerDto, logo });
  }

  @Get()
  @Message('Success get all partners')
  async getAll() {
    return await this.partnerService.getAll();
  }

  @Get(':id')
  @Message('Success get detail partner')
  async getById(@Param('id') id: string) {
    return await this.partnerService.getById(id);
  }

  @Put(':id')
  @Message('success update partner')
  @Auth(Role.ACADEMIC)
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') partnerId: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return await this.partnerService.update({
      ...updatePartnerDto,
      partnerId,
      logo,
    });
  }

  @Delete(':id')
  @Message('success delete partner')
  @Auth(Role.ACADEMIC)
  async delete(@Param('id') id: string) {
    return await this.partnerService.delete(id);
  }
}
