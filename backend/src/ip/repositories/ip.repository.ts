import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ip } from '../entities/ip.entity';

@Injectable()
export class IpRepository {
  constructor(
    @InjectRepository(Ip)
    private readonly ipRepository: Repository<Ip>,
  ) {}

  async getBySubnet(subnetId: number, page: number, pageSize: number, userId: string): Promise<Ip[]> {
    return await this.ipRepository.find({
      where: { subnetId, createdBy: userId },
      relations: ['subnet'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async countBySubnet(subnetId: number, userId: string): Promise<number> {
    return await this.ipRepository.count({
      where: { subnetId, createdBy: userId },
    });
  }

  async getById(id: number, userId: string): Promise<Ip | null> {
    return await this.ipRepository.findOne({
      where: { ipId: id, createdBy: userId },
      relations: ['subnet'],
    });
  }

  async create(ipData: Partial<Ip>): Promise<Ip> {
    const ip = this.ipRepository.create(ipData);
    return await this.ipRepository.save(ip);
  }

  async createMany(ipsData: Partial<Ip>[]): Promise<Ip[]> {
    const ips = this.ipRepository.create(ipsData);
    return await this.ipRepository.save(ips);
  }

  async update(id: number, ipData: Partial<Ip>): Promise<Ip> {
    await this.ipRepository.update(id, ipData);
    return await this.getById(id, ipData.createdBy);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.ipRepository.delete({ ipId: id, createdBy: userId });
  }
}
