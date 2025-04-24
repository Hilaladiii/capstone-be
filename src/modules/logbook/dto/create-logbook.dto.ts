import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogbookDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
