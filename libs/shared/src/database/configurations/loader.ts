import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const dbConfigLoader = registerAs('db', () => ({
  host: env.get('DB_HOST').default('localhost').asString(),
  port: env.get('DB_PORT').default('3306').asPortNumber(),
  user: env.get('DB_USER').default('root').asString(),
  password: env.get('DB_PASS').default('password').asString(),
  name: env.get('DB_NAME').required().asString(),
  logging: env.get('DB_LOGGING').default('false').asBool(),
  synchronize: env.get('DB_SYNCHRONIZE').default('false').asBool(),
}));
