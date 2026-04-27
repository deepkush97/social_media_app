import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import Redis, { RedisOptions } from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';

import { RedisConfigService } from './configurations/redis-config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  constructor(
    private readonly configService: RedisConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  onModuleInit(): void {
    const host = this.configService.host;
    const port = this.configService.port;
    const password = this.configService.password;
    const options: RedisOptions = {
      host,
      port,
    };

    if (password) {
      options.password = password;
    }

    this.redisClient = new Redis(options);

    this.logger.info(`Connected to Redis at ${host}:${port}`, { context: RedisService.name });
  }

  onModuleDestroy(): void {
    this.logger.info(`Bye bye, Redis is getting disconnect`, { context: RedisService.name });
    void this.redisClient.quit();
  }

  public getClient(): Redis {
    return this.redisClient;
  }
}
