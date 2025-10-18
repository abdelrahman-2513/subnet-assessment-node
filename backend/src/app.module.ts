import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filters/all-exception.filter';
import { TransformInterceptor } from './shared/transformers/transformer.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './auth/guards/auth.guard';
import { User } from './user/entities/user.entity';
import { Ip } from './ip/entities/ip.entity';
import { Subnet } from './subnet/entities/subnet.entity';
import { IpModule } from './ip/ip.module';
import { SubnetModule } from './subnet/subnet.module';


@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: configService.throttling.shortTtl,
            limit: configService.throttling.shortLimit,
          },
          {
            name: 'medium',
            ttl: configService.throttling.mediumTtl,
            limit: configService.throttling.mediumLimit,
          },
          {
            name: 'long',
            ttl: configService.throttling.longTtl,
            limit: configService.throttling.longLimit,
          },
        ],
        ignoreUserAgents: [
          /health-check/i,
        ],
      }),
    }),
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.database.host,
        port: configService.database.port,
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.database,
        entities: [User, Ip, Subnet],
        synchronize: true, 
        logging: false,
      }),
    }),
    AuthModule, 
    UserModule,
    IpModule,
    SubnetModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },{
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }],
})
export class AppModule {}
