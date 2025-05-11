import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';
import { ValidateGroupField } from 'src/commons/decorators/validate-group.decorator';

export class CreateInternshipApplicationCompetitionDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  @ValidateGroupField({ groupField: 'isGroup', type: 'string' })
  totalSks: string;

  @IsNotEmpty()
  @IsString()
  competitionName: string;

  @IsNotEmpty()
  @IsString()
  competitionSupervisor: string;

  @IsNotEmpty()
  @IsString()
  competitionCategory: string;

  @IsNotEmpty()
  @IsString()
  competitionOrganizer: string;

  @IsNotEmpty()
  @IsString()
  competitionInformation: string;

  @IsNotEmpty()
  @IsString()
  competitionLevel: string;

  @IsNotEmpty()
  @IsString()
  competitionWinner: string;

  @IsNotEmpty()
  @IsString()
  competitionProduct: string;

  @IsNotEmpty()
  @IsString()
  competitionStartDate: string;

  @IsNotEmpty()
  @IsString()
  competitionFinishDate: string;
}
