import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const gatewayConfigLoader = registerAs('gateway', () => ({
  jwtSecret: env.get('JWT_SECRET').required().asString(),
  jwtExpirationTimeInSeconds: env
    .get('JWT_EXPIRATION_TIME_IN_SECONDS')
    .default('3600')
    .asIntPositive(),
  isSwaggerEnabled: env.get('IS_SWAGGER_ENABLED').default('false').asBool(),
}));
