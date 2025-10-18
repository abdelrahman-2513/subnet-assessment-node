import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsOptional()
  @IsBoolean()
  createIps?: boolean;
}
