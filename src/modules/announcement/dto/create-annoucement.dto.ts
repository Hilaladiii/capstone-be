import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnnoucementDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
