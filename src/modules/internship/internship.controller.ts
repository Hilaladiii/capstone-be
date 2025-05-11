import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { GetCurrentUser } from 'src/commons/decorators/get-current-user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateInternshipApplicationCompanyDto } from './dto/create-internship-application-company.dto';
import { CreateInternshipExtensionDto } from './dto/create-internship-extension.dto';
import { CreateInternshipCancellationDto } from './dto/create-internship-cancellation.dto';
import { UpdateStatusDocumentDto } from './dto/update-status-document.dto';
import { CreateInternshipApplicationCompetitionDto } from './dto/create-internship-application-competition';

@Controller('internship')
export class InternshipController {
  constructor(private internshipService: InternshipService) {}

  @Post('application/company')
  @Message('Success create internship application')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('studyResultCardFile'))
  async createInternshipApplicationCompany(
    @GetCurrentUser('nim') studentNimApply: string,
    @Body()
    createInternshipApplicationCompanyDto: CreateInternshipApplicationCompanyDto,
    @UploadedFile() studyResultCardFile: Express.Multer.File,
  ) {
    if (!studyResultCardFile)
      throw new BadRequestException('study result card file must be provided');
    return await this.internshipService.createInternshipApplicationCompany({
      ...createInternshipApplicationCompanyDto,
      studyResultCardFile,
      studentNimApply,
    });
  }

  @Post('application/competition')
  @Message('Success create internship application')
  @Auth(Role.STUDENT)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'studyResultCardFile',
      },
      {
        name: 'proposalCompetitionSertificationFile',
      },
    ]),
  )
  async createInternshipApplicationCompetition(
    @GetCurrentUser('nim') studentNimApply: string,
    @Body()
    createInternshipApplicationCompetitionDto: CreateInternshipApplicationCompetitionDto,
    @UploadedFiles()
    files: {
      studyResultCardFile: Express.Multer.File;
      proposalCompetitionSertificationFile: Express.Multer.File;
    },
  ) {
    const studyResultCardFile = files.studyResultCardFile?.[0];
    const proposalCompetitionSertificationFile =
      files.proposalCompetitionSertificationFile?.[0];

    if (!studyResultCardFile || !proposalCompetitionSertificationFile)
      throw new BadRequestException(
        'Study result card,proposal competition, sertification must be provided',
      );
    return await this.internshipService.createInternshipApplicationCompetition({
      ...createInternshipApplicationCompetitionDto,
      studyResultCardFile,
      proposalCompetitionSertificationFile,
      studentNimApply,
    });
  }

  @Post('extension')
  @Message('Success create internship extension')
  @Auth(Role.STUDENT)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'internshipApplicationFile' },
      { name: 'intershipExtensionFile' },
    ]),
  )
  async createInternshipExtension(
    @GetCurrentUser('nim') studentNimApply: string,
    @Body() createInternshipExtensionDto: CreateInternshipExtensionDto,
    @UploadedFiles()
    files: {
      internshipApplicationFile: Express.Multer.File;
      intershipExtensionFile: Express.Multer.File;
    },
  ) {
    const internshipApplicationFile = files?.internshipApplicationFile?.[0];
    const intershipExtensionFile = files?.intershipExtensionFile?.[0];

    if (!internshipApplicationFile || !intershipExtensionFile)
      throw new BadRequestException(
        'Internship application & internship extension file must be provided',
      );

    return await this.internshipService.createInternshipExtension({
      ...createInternshipExtensionDto,
      studentNimApply,
      internshipApplicationFile,
      intershipExtensionFile,
    });
  }

  @Post('cancellation')
  @Message('Success create internship cancellation')
  @Auth(Role.STUDENT)
  @UseInterceptors(FileInterceptor('supportingDocumentFile'))
  async createInternshipCancellation(
    @GetCurrentUser('nim') studentNimApply: string,
    @Body() createInternshipCancellationDto: CreateInternshipCancellationDto,
    @UploadedFile() supportingDocumentFile: Express.Multer.File,
  ) {
    if (!supportingDocumentFile)
      throw new BadRequestException('Supporting document must be provided');
    return await this.internshipService.createInternshipCancellation({
      ...createInternshipCancellationDto,
      studentNimApply,
      supportingDocumentFile,
    });
  }

  @Patch(':id/status')
  @Message('Success update status document')
  @Auth(Role.ACADEMIC, Role.HEAD_STUDY_PROGRAM)
  async updateSuccessStatus(
    @Param('id') documentId: string,
    @Body() updateStatusDocumentDto: UpdateStatusDocumentDto,
  ) {
    return await this.internshipService.updateStatus({
      documentId,
      ...updateStatusDocumentDto,
    });
  }

  @Get('status')
  @Message('Success get status')
  @Auth(Role.STUDENT)
  async getStatus(@GetCurrentUser('nim') nim: string) {
    return await this.internshipService.getStatus(nim);
  }
}
