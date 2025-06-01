import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNumber()
  sks: number;

  @IsOptional()
  @IsNumber()
  year: number;
}
