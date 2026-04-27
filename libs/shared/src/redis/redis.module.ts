import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { redisConfigLoader } from './configurations/loader';
import { RedisConfigService } from './configurations/redis-config.service';

import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule.forFeature(redisConfigLoader), RedisModule],
  providers: [RedisService, RedisConfigService],
  exports: [RedisService, RedisConfigService],
})
export class RedisModule {}
