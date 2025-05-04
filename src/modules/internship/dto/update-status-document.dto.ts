import { DocumentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDocumentDto {
  @IsOptional()
  @IsString()
  rejectionReason: string;

  @IsNotEmpty()
  @IsEnum(DocumentStatus)
  status: DocumentStatus;
}
