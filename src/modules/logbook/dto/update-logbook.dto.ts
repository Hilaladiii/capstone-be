import { IsOptional, IsString } from 'class-validator';

export class UpdateLogbookDto {
  @IsOptional()
  @IsString()
  description?: string;
}
