import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis, { RedisOptions } from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  onModuleInit(): void {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
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
