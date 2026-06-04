import { Global, Module } from '@nestjs/common';

import { GraphqlConfigModule } from './configurations/graphql-config.module';
import { GraphqlConfigService } from './configurations/graphql-config.service';

import { GraphqlRouterComposite } from './graphql-router.composite';
import { GraphqlRouterConfigurableModuleClass } from './graphql-router.definition';
import { GraphqlRouterService } from './graphql-router.service';

@Global()
@Module({
  imports: [GraphqlConfigModule],
  providers: [GraphqlRouterService, GraphqlRouterComposite, GraphqlConfigService],
  exports: [GraphqlRouterService, GraphqlRouterComposite, GraphqlConfigService],
})
export class GraphqlRouterModule extends GraphqlRouterConfigurableModuleClass {}
