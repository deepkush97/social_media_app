import { Module } from '@nestjs/common';

import { GraphqlRouterConfigurableModuleClass } from './graphql-router.definition';
import { GraphqlRouterService } from './graphql-router.service';

@Module({
  providers: [GraphqlRouterService],
  exports: [GraphqlRouterService],
})
export class GraphqlRouterModule extends GraphqlRouterConfigurableModuleClass {}
