import { Injectable, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { SubnetRepository } from '../repositories/subnet.repository';
import { IpService } from '../../ip/services/ip.service';
import { CreateSubnetDto } from '../dtos/create-subnet.dto';
import { UpdateSubnetDto } from '../dtos/update-subnet.dto';
import { FileUploadDto } from '../dtos/file-upload.dto';
import { Subnet } from '../entities/subnet.entity';
import { SubnetValidator } from '../helpers/subnet-validator.helper';
import { SubnetHelper } from '../helpers/subnet-helper';
import { ResponseDto } from '../../shared/dtos/respone.dto';
import { PaginatedResponseDto } from '../../shared/dtos/paginated-response.dto';
import { EResponse } from '../../shared/enums';

@Injectable()
export class SubnetService {
  constructor(
    private readonly subnetRepository: SubnetRepository,
    @Inject(forwardRef(() => IpService))
    private readonly ipService: IpService,
  ) {}

  async createSubnet(createSubnetDto: CreateSubnetDto, userId: string): Promise<ResponseDto<Subnet>> {
    try {
      if (!SubnetValidator.isValidCidr(createSubnetDto.subnetAddress)) {
        return {
          status: EResponse.FAILED,
          message: 'Invalid CIDR notation for subnet address.',
          data: null,
        };
      }

      const existingSubnet = await this.subnetRepository.exists(createSubnetDto.subnetAddress, userId);
      if (existingSubnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet with the same address already exists.',
          data: null,
        };
      }

      const subnet = await this.subnetRepository.create({
        subnetName: createSubnetDto.subnetName,
        subnetAddress: createSubnetDto.subnetAddress,
        createdBy: userId,
      });

      if (createSubnetDto.createIps) {
        const ips = SubnetHelper.generateIpsFromCidr(createSubnetDto.subnetAddress);
        await this.ipService.createBulkIps(subnet.subnetId, ips, userId);
      }

      return {
        status: EResponse.SUCCESS,
        message: 'Subnet created successfully.',
        data: subnet,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while creating subnet.');
    }
  }

  async uploadSubnetsFromFile(fileUploadDto: FileUploadDto, userId: string): Promise<ResponseDto<string>> {
    try {
      const subnets: Subnet[] = [];
      const failedSubnets: string[] = [];

      const fileContent = fileUploadDto.file.buffer.toString('utf-8');
      const lines = fileContent.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;

        const parts = line.split(',').map(part => part.trim());
        if (parts.length < 2) {
          failedSubnets.push(line);
          continue;
        }

        const subnetName = parts[0];
        const subnetAddress = parts[1];

        const result = await this.createSubnet({
          subnetName,
          subnetAddress,
          createIps: fileUploadDto.createIps,
        }, userId);

        if (result.status === EResponse.SUCCESS && result.data) {
          subnets.push(result.data);
        } else {
          failedSubnets.push(`${subnetName} (${subnetAddress})`);
        }
      }

      const message = `Uploaded ${subnets.length} subnets. Failed: ${failedSubnets.length}`;
      const finalMessage = failedSubnets.length > 0 
        ? `${message} — Failed entries: ${failedSubnets.join(', ')}`
        : message;

      return {
        status: EResponse.SUCCESS,
        message: finalMessage,
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while processing the file upload.');
    }
  }

  async getAllSubnets(page: number, pageSize: number, userId: string): Promise<PaginatedResponseDto<Subnet>> {
    try {
      const subnets = await this.subnetRepository.getAll(page, pageSize, userId);
      const totalCount = await this.subnetRepository.count(userId);

      return {
        status: EResponse.SUCCESS,
        message: 'Subnets fetched successfully.',
        data: subnets,
        totalCount,
        pageNumber: page,
        pageSize,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch subnets due to an internal error.');
    }
  }

  async getSubnetById(id: number, userId: string): Promise<ResponseDto<Subnet>> {
    try {
      const subnet = await this.subnetRepository.getById(id, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found.',
          data: null,
        };
      }

      return {
        status: EResponse.SUCCESS,
        message: 'Subnet retrieved successfully.',
        data: subnet,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while fetching the subnet.');
    }
  }

  async updateSubnet(id: number, updateSubnetDto: UpdateSubnetDto, userId: string): Promise<ResponseDto<Subnet>> {
    try {
      if (updateSubnetDto.subnetAddress && !SubnetValidator.isValidCidr(updateSubnetDto.subnetAddress)) {
        return {
          status: EResponse.FAILED,
          message: 'Invalid CIDR notation for subnet address.',
          data: null,
        };
      }

      const subnet = await this.subnetRepository.getById(id, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found.',
          data: null,
        };
      }

      const updatedSubnet = await this.subnetRepository.update(id, {
        ...updateSubnetDto,
        createdBy: userId,
      });

      return {
        status: EResponse.SUCCESS,
        message: 'Subnet updated successfully.',
        data: updatedSubnet,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while updating subnet.');
    }
  }

  async deleteSubnet(id: number, userId: string): Promise<ResponseDto<boolean>> {
    try {
      const subnet = await this.subnetRepository.getById(id, userId);
      if (!subnet) {
        return {
          status: EResponse.FAILED,
          message: 'Subnet not found.',
          data: null,
        };
      }

      await this.subnetRepository.delete(id, userId);

      return {
        status: EResponse.SUCCESS,
        message: 'Subnet deleted successfully.',
        data: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while deleting subnet.');
    }
  }
}