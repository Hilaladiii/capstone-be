import { ConsultationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackConsultationDto {
  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsEnum(ConsultationStatus)
  agreementStatus: ConsultationStatus;
}
