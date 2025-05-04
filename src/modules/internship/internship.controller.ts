import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/commons/decorators/auth.decorator';
import { Message } from 'src/commons/decorators/message.decorator';
import { Role } from 'src/commons/types/role.type';
import { InternshipService } from './internship.service';
import { CreateInternshipApplicationDto } from './dto/create-internship-application.dto';
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateInternshipExtensionDto } from './dto/create-internship-extension.dto';
import { CreateInternshipCancellationDto } from './dto/create-internship-cancellation.dto';
import { UpdateStatusDocumentDto } from './dto/update-status-document.dto';

@Controller('internship')
export class InternshipController {
  constructor(private internshipService: InternshipService) {}

  @Post('application')
  @Message('Success create internship application')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  async createInternshipApplication(
    @GetCurrentUser('nim') nim: string,
    @Body() createInternshipApplicationDto: CreateInternshipApplicationDto,
    @UploadedFile() studyResultCardFile: Express.Multer.File,
  ) {
    if (!studyResultCardFile)
      throw new BadRequestException('study result card file must be provided');
    return await this.internshipService.createInternshipApplication({
      ...createInternshipApplicationDto,
      studyResultCardFile,
      nim,
    });
  }

  @Post('extension')
  @Message('Success create internship extension')
  @Auth(Role.STUDENT)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'internshipApplicationFile', maxCount: 1 },
      { name: 'intershipExtensionFile', maxCount: 1 },
    ]),
  )
  async createInternshipExtension(
    @GetCurrentUser('nim') nim: string,
    @Body() createInternshipExtensionDto: CreateInternshipExtensionDto,
    @UploadedFiles()
    files: {
      internshipApplicationFile: Express.Multer.File[];
      intershipExtensionFile: Express.Multer.File[];
    },
  ) {
    const internshipApplicationFile = files.internshipApplicationFile?.[0];
    const intershipExtensionFile = files.intershipExtensionFile?.[0];

    return await this.internshipService.createInternshipExtension({
      ...createInternshipExtensionDto,
      nim,
      internshipApplicationFile,
      intershipExtensionFile,
    });
  }

  @Post('cancellation')
  @Message('Success create internship cancellation')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('supportingDocument'))
  async createInternshipCancellation(
    @GetCurrentUser('nim') nim: string,
    @Body() createInternshipCancellationDto: CreateInternshipCancellationDto,
    @UploadedFile() supportingDocument: Express.Multer.File,
  ) {
    return await this.internshipService.createInternshipCancellation({
      ...createInternshipCancellationDto,
      nim,
      supportingDocument,
    });
  }

  @Patch(':id/status')
  @Message('Success update status document')
  @Auth(Role.ACADEMIC, Role.HEAD_LECTURER)
  async updateSuccessStatus(
    @Param('id') documentId: string,
    @Body() updateStatusDocumentDto: UpdateStatusDocumentDto,
  ) {
    return await this.internshipService.updateStatus({
      documentId,
      ...updateStatusDocumentDto,
    });
  }
}
