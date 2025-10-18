import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSubnetDto {
  @IsNotEmpty()
  @IsString()
  subnetName: string;

  @IsNotEmpty()
  @IsString()
  subnetAddress: string;

  @IsOptional()
  @IsBoolean()
  createIps?: boolean;
}
