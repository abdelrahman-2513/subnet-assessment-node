import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubnetController } from './controllers/subnet.controller';
import { SubnetService } from './services/subnet.service';
import { SubnetRepository } from './repositories/subnet.repository';
import { Subnet } from './entities/subnet.entity';
import { IpModule } from '../ip/ip.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subnet]),
    forwardRef(() => IpModule),
    ConfigModule,
  ],
  controllers: [SubnetController],
  providers: [SubnetService, SubnetRepository],
  exports: [SubnetService, SubnetRepository],
})
export class SubnetModule {}
