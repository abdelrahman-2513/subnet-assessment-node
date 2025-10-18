import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpController } from './controllers/ip.controller';
import { IpService } from './services/ip.service';
import { IpRepository } from './repositories/ip.repository';
import { Ip } from './entities/ip.entity';
import { SubnetModule } from '../subnet/subnet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ip]),
    forwardRef(() => SubnetModule),
  ],
  controllers: [IpController],
  providers: [IpService, IpRepository],
  exports: [IpService, IpRepository],
})
export class IpModule {}
