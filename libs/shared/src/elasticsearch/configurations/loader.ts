import { registerAs } from '@nestjs/config';

import * as env from 'env-var';

export const elasticsearchConfigLoader = registerAs('elasticsearch', () => ({
  url: env.get('ELASTICSEARCH_URL').default('http://localhost:9200').asString(),
}));
