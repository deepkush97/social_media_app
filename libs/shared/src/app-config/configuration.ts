import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

import { AppEnvironment } from '../enums/app-environment.enum';
import { AppLogLevel } from '../enums/app-log-level.enum';

export const configLoader = registerAs('app', () => ({
  env: env.get('APP_ENV').default(AppEnvironment.production).asEnum(Object.values(AppEnvironment)),
  name: env.get('APP_NAME').required().asString(),
  port: env.get('APP_PORT').required().asPortNumber(),
  logLevel: env.get('APP_LOG_LEVEL').default(AppLogLevel.info).asEnum(Object.values(AppLogLevel)),

  dbHost: env.get('DB_HOST').default('localhost'),
  dbPort: env.get('DB_PORT').default('3306').asPortNumber(),
  dbUser: env.get('DB_USER').default('root').asString(),
  dbPass: env.get('DB_PASS').default('password').asString(),
  dbName: env.get('DB_NAME').required().asString(),
  dbLogging: env.get('DB_LOGGING').default('false').asBool(),

  jwtSecret: env.get('JWT_SECRET').required().asString(),
  jwtExpirationTimeInSeconds: env
    .get('JWT_EXPIRATION_TIME_IN_SECONDS')
    .default('3600')
    .asIntPositive(),

  redisHost: env.get('REDIS_HOST').default('localhost').asString(),
  redisPort: env.get('REDIS_PORT').default('6379').asPortNumber(),
  redisPassword: env.get('REDIS_PASSWORD').asString(),
}));
