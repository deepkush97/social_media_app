import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const natsConfigLoader = registerAs('nats', () => ({
  url: env.get('NATS_URL').default('nats://localhost:4222').asString(),
}));
