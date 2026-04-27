import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

import { AppEnvironment } from '../enums/app-environment.enum';
import { AppLogLevel } from '../enums/app-log-level.enum';

export const configLoader = registerAs('app', () => ({
  env: env.get('APP_ENV').default(AppEnvironment.production).asEnum(Object.values(AppEnvironment)),
  name: env.get('APP_NAME').required().asString(),
  port: env.get('APP_PORT').required().asPortNumber(),
  logLevel: env.get('APP_LOG_LEVEL').default(AppLogLevel.info).asEnum(Object.values(AppLogLevel)),

  jwtSecret: env.get('JWT_SECRET').required().asString(),
  jwtExpirationTimeInSeconds: env
    .get('JWT_EXPIRATION_TIME_IN_SECONDS')
    .default('3600')
    .asIntPositive(),

  graphqlRouterUrl: env.get('GRAPHQL_ROUTER_URL').required().asString(),
  isSwaggerEnabled: env.get('IS_SWAGGER_ENABLED').default('false').asBool(),
}));
