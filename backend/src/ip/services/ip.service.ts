import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { IpRepository } from '../repositories/ip.repository';
import { SubnetRepository } from '../../subnet/repositories/subnet.repository';
import { CreateIpDto } from '../dtos/create-ip.dto';
import { UpdateIpDto } from '../dtos/update-ip.dto';
import { Ip } from '../entities/ip.entity';
import { ResponseDto } from '../../shared/dtos/respone.dto';
import { PaginatedResponseDto } from '../../shared/dtos/paginated-response.dto';
import { EResponse } from '../../shared/enums';

@Injectable()
export class IpService {
  constructor(
    private readonly ipRepository: IpRepository,
    @Inject(forwardRef(() => SubnetRepository))
    private readonly subnetRepository: SubnetRepository,
  ) {}

  async createIp(createIpDto: CreateIpDto, userId: string): Promise<ResponseDto<Ip>> {
    try {
      if (!this.isValidIpAddress(createIpDto.ipAddress)) {
        return {
          status: EResponse.FAILED,
          message: 'Invalid IP address format.',
          data: null,
        };
      }

      const subnet = await this.subnetRepository.getById(createIpDto.subnetId, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found or not owned by the user.',
          data: null,
        };
      }

      const ip = await this.ipRepository.create({
        ipAddress: createIpDto.ipAddress,
        subnetId: createIpDto.subnetId,
        createdBy: userId,
      });

      return {
        status: EResponse.SUCCESS,
        message: 'IP created successfully.',
        data: ip,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while creating the IP.');
    }
  }

  async createBulkIps(subnetId: number, ipAddresses: string[], userId: string): Promise<ResponseDto<Ip[]>> {
    try {
      const subnet = await this.subnetRepository.getById(subnetId, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found or not owned by the user.',
          data: null,
        };
      }

      const ips = ipAddresses.map(ipAddress => ({
        ipAddress,
        subnetId,
        createdBy: userId,
      }));

      const createdIps = await this.ipRepository.createMany(ips);

      return {
        status: EResponse.SUCCESS,
        message: 'Bulk IPs created successfully.',
        data: createdIps,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while creating bulk IPs.');
    }
  }

  async getIpsBySubnet(subnetId: number, page: number, pageSize: number, userId: string): Promise<PaginatedResponseDto<Ip>> {
    try {
      const subnet = await this.subnetRepository.getById(subnetId, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found or not owned by the user.',
          data: null,
          totalCount: 0,
          pageNumber: page,
          pageSize,
        };
      }

      const ips = await this.ipRepository.getBySubnet(subnetId, page, pageSize, userId);
      const totalCount = await this.ipRepository.countBySubnet(subnetId, userId);

      return {
        status: EResponse.SUCCESS,
        message: 'IPs fetched successfully.',
        data: ips,
        totalCount,
        pageNumber: page,
        pageSize,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while fetching IPs.');
    }
  }

  async updateIp(id: number, updateIpDto: UpdateIpDto, userId: string): Promise<ResponseDto<Ip>> {
    try {
      if (updateIpDto.ipAddress && !this.isValidIpAddress(updateIpDto.ipAddress)) {
        return {
          status: EResponse.FAILED,
          message: 'Invalid IP address format.',
          data: null,
        };
      }

      const ip = await this.ipRepository.getById(id, userId);
      if (!ip) {
        return {
          status: EResponse.FAILED,
          message: 'IP not found or not owned by the user.',
          data: null,
        };
      }

      const updatedIp = await this.ipRepository.update(id, {
        ...updateIpDto,
        createdBy: userId,
      });

      return {
        status: EResponse.SUCCESS,
        message: 'IP updated successfully.',
        data: updatedIp,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while updating the IP.');
    }
  }

  async deleteIp(id: number, userId: string): Promise<ResponseDto<boolean>> {
    try {
      const ip = await this.ipRepository.getById(id, userId);
      if (!ip) {
        return {
          status: EResponse.FAILED,
          message: 'IP not found or not owned by the user.',
          data: null,
        };
      }

      await this.ipRepository.delete(id, userId);

      return {
        status: EResponse.SUCCESS,
        message: 'IP deleted successfully.',
        data: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while deleting the IP.');
    }
  }

  private isValidIpAddress(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  }
}