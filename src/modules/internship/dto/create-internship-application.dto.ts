import { InternshipType } from '@prisma/client';
import { CreateDocumentDto } from './create-document.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateInternshipApplicationDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsEnum(InternshipType)
  type: InternshipType;

  @IsNotEmpty()
  @IsString()
  recipientOfLetter: string;

  @IsNotEmpty()
  @IsString()
  internshipObject: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;
}
