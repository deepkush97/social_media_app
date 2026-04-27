import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const redisConfigLoader = registerAs('redis', () => ({
  host: env.get('REDIS_HOST').default('localhost').asString(),
  port: env.get('REDIS_PORT').default('6379').asPortNumber(),
  password: env.get('REDIS_PASSWORD').asString(),
}));
