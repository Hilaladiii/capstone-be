import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  nim: string;

  @IsNotEmpty()
  @IsNumber()
  sks: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
