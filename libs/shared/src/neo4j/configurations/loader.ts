import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const neo4jConfigLoader = registerAs('neo4j', () => ({
  protocol: env.get('NEO4J_PROTOCOL').default('bolt').asString(),
  host: env.get('NEO4J_HOST').default('localhost').asString(),
  port: env.get('NEO4J_PORT').default(7687).asPortNumber(),
  username: env.get('NEO4J_USERNAME').required().asString(),
  password: env.get('NEO4J_PASSWORD').required().asString(),
}));
