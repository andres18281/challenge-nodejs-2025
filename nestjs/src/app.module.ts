import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrdersModule } from './orders/orders.module';
import { RedisModule } from './redis/redis.module';

import { databaseConfig } from './config/database.config';
import { createRedisClient } from './config/redis.config';

import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot(databaseConfig()),
    OrdersModule,
    RedisModule,
     ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: createRedisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class AppModule {}
