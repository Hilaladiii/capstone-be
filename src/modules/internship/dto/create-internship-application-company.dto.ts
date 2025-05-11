import { CreateDocumentDto } from './create-document.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateGroupField } from 'src/commons/decorators/validate-group.decorator';

export class CreateInternshipApplicationCompanyDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  agencyName: string;

  @IsNotEmpty()
  @IsString()
  agencyAddress: string;

  @IsNotEmpty()
  @IsString()
  @ValidateGroupField({ groupField: 'isGroup', type: 'string' })
  totalSks: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  finishDate: string;

  @IsNotEmpty()
  @IsString()
  internshipObject: string;

  @IsNotEmpty()
  @IsString()
  recipientOfLetter: string;
}
