import { Module } from '@nestjs/common';
import { createRedisClient } from '../config/redis.config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => createRedisClient(),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}