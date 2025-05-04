import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

export class CreateInternshipExtensionDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  submissionDate: string;

  @IsNotEmpty()
  @IsString()
  reasonExtension: string;
}
