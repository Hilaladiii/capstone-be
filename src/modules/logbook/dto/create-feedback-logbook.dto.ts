import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackLogbookDto {
  @IsNotEmpty()
  @IsString()
  note: string;
}
