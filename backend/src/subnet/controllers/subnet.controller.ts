import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubnetService } from '../services/subnet.service';
import { CreateSubnetDto } from '../dtos/create-subnet.dto';
import { UpdateSubnetDto } from '../dtos/update-subnet.dto';
import { FileUploadDto } from '../dtos/file-upload.dto';
import { ResponseDto } from '../../shared/dtos/respone.dto';
import { PaginatedResponseDto } from '../../shared/dtos/paginated-response.dto';
import { EResponse } from '../../shared/enums';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ATPayload } from '../../shared/types/jwt-payload.type';
import { Subnet } from '../entities/subnet.entity';
import { ConfigService } from '../../config/config.service';

@Controller('subnet')
export class SubnetController {
  constructor(
    private readonly subnetService: SubnetService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSubnet(
    @Body() createSubnetDto: CreateSubnetDto,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<Subnet>> {
    const result = await this.subnetService.createSubnet(createSubnetDto, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getSubnets(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @CurrentUser() user: ATPayload,
  ): Promise<PaginatedResponseDto<Subnet>> {
    const result = await this.subnetService.getAllSubnets(page, pageSize, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
      totalCount: result.totalCount,
      pageNumber: result.pageNumber,
      pageSize: result.pageSize,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateSubnet(
    @Param('id') id: number,
    @Body() updateSubnetDto: UpdateSubnetDto,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<Subnet>> {
    const result = await this.subnetService.updateSubnet(id, updateSubnetDto, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubnet(
    @Param('id') id: number,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.subnetService.deleteSubnet(id, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV or TXT files are allowed'), false);
      }
    },
  }))
  @HttpCode(HttpStatus.OK)
  async uploadSubnets(
    @UploadedFile() file: Express.Multer.File,
    @Body('createIps') createIps: string,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<string>> {
    if (!file || file.size === 0) {
      throw new BadRequestException('File is required and cannot be empty.');
    }

    const fileUploadDto: FileUploadDto = {
      file,
      createIps: createIps === 'true',
    };

    const result = await this.subnetService.uploadSubnetsFromFile(fileUploadDto, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }
}
