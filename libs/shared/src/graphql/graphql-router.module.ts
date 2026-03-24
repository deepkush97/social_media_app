import { Module } from '@nestjs/common';

import { GraphqlRouterComposite } from './graphql-router.composite';
import { GraphqlRouterConfigurableModuleClass } from './graphql-router.definition';
import { GraphqlRouterService } from './graphql-router.service';

@Module({
  providers: [GraphqlRouterService, GraphqlRouterComposite],
  exports: [GraphqlRouterService, GraphqlRouterComposite],
})
export class GraphqlRouterModule extends GraphqlRouterConfigurableModuleClass {}
