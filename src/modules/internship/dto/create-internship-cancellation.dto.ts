import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

export class CreateInternshipCancellationDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  recipientOfLetter: string;

  @IsNotEmpty()
  @IsString()
  reasonCancellation: string;
}
