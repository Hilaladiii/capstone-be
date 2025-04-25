import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLoginIdentifierValid', async: false })
class IsLoginIdentifierValidConstraint implements ValidatorConstraintInterface {
  validate(_: any, validationArguments?: ValidationArguments) {
    const obj = validationArguments.object as LoginDto;
    return Boolean(obj.email || obj.nim || obj.nip);
  }

  defaultMessage(_?: ValidationArguments): string {
    return 'Please provide valid login credentials';
  }
}

export class LoginDto {
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  nim?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  nip?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Validate(IsLoginIdentifierValidConstraint)
  _validateIdentifiers?: never;
}
