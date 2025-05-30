import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';
import { ValidateGroupField } from 'src/commons/decorators/validate-group.decorator';

export class CreateInternshipExtensionDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  @ValidateGroupField({ groupField: 'isGroup', type: 'string' })
  totalSks: string;

  @IsNotEmpty()
  @IsString()
  agencyName: string;

  @IsNotEmpty()
  @IsString()
  agencyAddress: string;

  @IsNotEmpty()
  @IsString()
  startDatePeriod: string;

  @IsNotEmpty()
  @IsString()
  finishDatePeriod: string;

  @IsNotEmpty()
  @IsString()
  startExtensionDatePeriod: string;

  @IsNotEmpty()
  @IsString()
  finishExtensionDatePeriod: string;

  @IsNotEmpty()
  @IsString()
  reasonExtension: string;
}
