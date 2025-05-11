import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidateGroupField } from 'src/commons/decorators/validate-group.decorator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  @ValidateGroupField({ type: 'string', groupField: 'isGroup' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  @MaxLength(47)
  @ValidateGroupField({ type: 'string', groupField: 'isGroup' })
  nim: string;

  @IsNotEmpty()
  @IsString()
  @ValidateGroupField({
    type: 'email',
    groupField: 'isGroup',
    emailDomain: '@student.ub.ac.id',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  @MaxLength(12)
  phoneNumber: string;

  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value == true)
  @IsBoolean()
  isGroup: boolean;
}
