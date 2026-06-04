import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const graphqlConfigLoader = registerAs('graphql', () => ({
  url: env.get('GRAPHQL_ROUTER_URL').required().asString(),
}));
