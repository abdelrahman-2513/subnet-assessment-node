import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { IpService } from '../services/ip.service';
import { CreateIpDto } from '../dtos/create-ip.dto';
import { UpdateIpDto } from '../dtos/update-ip.dto';
import { ResponseDto } from '../../shared/dtos/respone.dto';
import { PaginatedResponseDto } from '../../shared/dtos/paginated-response.dto';
import { EResponse } from '../../shared/enums';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ATPayload } from '../../shared/types/jwt-payload.type';
import { Ip } from '../entities/ip.entity';

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createIp(
    @Body() createIpDto: CreateIpDto,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<Ip>> {
    const result = await this.ipService.createIp(createIpDto, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getIps(
    @Query('subnetId') subnetId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @CurrentUser() user: ATPayload,
  ): Promise<PaginatedResponseDto<Ip>> {
    const result = await this.ipService.getIpsBySubnet(subnetId, page, pageSize, user.id);
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
  async updateIp(
    @Param('id') id: number,
    @Body() updateIpDto: UpdateIpDto,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<Ip>> {
    const result = await this.ipService.updateIp(id, updateIpDto, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteIp(
    @Param('id') id: number,
    @CurrentUser() user: ATPayload,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.ipService.deleteIp(id, user.id);
    return {
      status: result.status === EResponse.SUCCESS ? EResponse.SUCCESS : EResponse.FAILED,
      message: result.message,
      data: result.data,
    };
  }
}
