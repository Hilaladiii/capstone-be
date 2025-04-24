import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

export class CreateAcademicDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nip: string;
}
