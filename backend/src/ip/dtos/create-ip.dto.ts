import { IsNotEmpty, IsString, IsInt, IsIP } from 'class-validator';

export class CreateIpDto {
  @IsNotEmpty()
  @IsString()
  @IsIP()
  ipAddress: string;

  @IsNotEmpty()
  @IsInt()
  subnetId: number;
}
