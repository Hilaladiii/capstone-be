import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nim: string;

  @IsNotEmpty()
  @IsNumber()
  sks: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
