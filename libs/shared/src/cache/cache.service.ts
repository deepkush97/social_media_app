import { Injectable, OnModuleInit } from '@nestjs/common';

import Redis from 'ioredis';

import { AppLoggerService } from '../app-logger/app-logger.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService implements OnModuleInit {
  private redisClient: Redis;
  constructor(
    private readonly logger: AppLoggerService,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit(): void {
    this.redisClient = this.redisService.getClient();
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.info(`get: key ${key}`, { context: CacheService.name });
    const value = await this.redisClient.get(key);
    if (!value) {
      this.logger.info(`get: cache missed ${key}`, { context: CacheService.name });
      return null;
    }
    this.logger.info(`get: cache success ${key}`, { context: CacheService.name });
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    this.logger.info(`set: key ${key} ttl ${ttl}`, { context: CacheService.name });

    if (ttl) {
      this.logger.info(`set: cache set ${key} with ttl ${ttl}`, { context: CacheService.name });
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      this.logger.info(`set: cache set ${key}`, { context: CacheService.name });
      await this.redisClient.set(key, JSON.stringify(value));
    }
  }

  async del(key: string): Promise<void> {
    this.logger.info(`del: key ${key}`, { context: CacheService.name });

    await this.redisClient.del(key);
  }

  async delAll(pattern: string, batchSize = 10): Promise<void> {
    this.logger.info(`delAll: pattern ${pattern} batchSize ${batchSize}`, {
      context: CacheService.name,
    });

    return new Promise<void>((resolve, reject) => {
      const stream = this.redisClient.scanStream({
        match: pattern,
        count: batchSize,
      });

      let pipeline = this.redisClient.pipeline();
      let localKeys: string[] = [];

      stream.on('data', (resultKeys: string[]) => {
        this.logger.debug(`delAll: keys found ${resultKeys.length}`, {
          context: CacheService.name,
        });
        for (const resultKey of resultKeys) {
          localKeys.push(resultKey);
          pipeline.del(resultKey);
        }

        if (localKeys.length > batchSize) {
          void pipeline.exec((error, result) => {
            if (error)
              this.logger.error('error in executing pipeline', {
                error,
                context: CacheService.name,
              });
            if (result)
              this.logger.info('batch completed', { data: result, context: CacheService.name });
          });
          localKeys = [];
          pipeline = this.redisClient.pipeline();
        }
      });

      stream.on('end', () => {
        void pipeline.exec((error, result) => {
          if (error) {
            this.logger.error('error in executing pipeline', { error, context: CacheService.name });
            reject(error);
          } else {
            if (result)
              this.logger.info('batch completed', { data: result, context: CacheService.name });
            resolve();
          }
        });
      });

      stream.on('error', (error) => {
        this.logger.error('error in stream', { error, context: CacheService.name });
        reject(error);
      });
    });
  }
}
