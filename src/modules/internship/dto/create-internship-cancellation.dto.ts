import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

export class CreateInternshipCancellationDto extends CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  agencyName: string;

  @IsNotEmpty()
  @IsString()
  agencyAddress: string;

  @IsNotEmpty()
  @IsString()
  cancellationReason: string;
}
