import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-.]+@(student\.ub\.ac\.id|ub\.ac\.id)$/, {
    message: 'Email must be from @student.ub.ac.id or @ub.ac.id',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
