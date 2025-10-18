import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subnet } from '../entities/subnet.entity';

@Injectable()
export class SubnetRepository {
  constructor(
    @InjectRepository(Subnet)
    private readonly subnetRepository: Repository<Subnet>,
  ) {}

  async getAll(page: number, pageSize: number, userId: string): Promise<Subnet[]> {
    return await this.subnetRepository.find({
      where: { createdBy: userId },
      relations: ['ips'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async count(userId: string): Promise<number> {
    return await this.subnetRepository.count({
      where: { createdBy: userId },
    });
  }

  async getById(id: number, userId: string): Promise<Subnet | null> {
    return await this.subnetRepository.findOne({
      where: { subnetId: id, createdBy: userId },
      relations: ['ips'],
    });
  }

  async create(subnetData: Partial<Subnet>): Promise<Subnet> {
    const subnet = this.subnetRepository.create(subnetData);
    return await this.subnetRepository.save(subnet);
  }

  async update(id: number, subnetData: Partial<Subnet>): Promise<Subnet> {
    await this.subnetRepository.update(id, subnetData);
    return await this.getById(id, subnetData.createdBy);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.subnetRepository.delete({ subnetId: id, createdBy: userId });
  }

  async exists(address: string, userId: string): Promise<boolean> {
    const count = await this.subnetRepository.count({
      where: { subnetAddress: address, createdBy: userId },
    });
    return count > 0;
  }
}
