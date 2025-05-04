import { IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  partnerUrl: string;
}
