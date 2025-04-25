import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectSupervisorDto {
  @IsNotEmpty()
  @IsString()
  nip: string;
}
