import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GraphqlConfigService } from './graphql-config.service';
import { graphqlConfigLoader } from './loader';

@Module({
  imports: [ConfigModule.forFeature(graphqlConfigLoader)],
  providers: [GraphqlConfigService],
  exports: [GraphqlConfigService],
})
export class GraphqlConfigModule {}
