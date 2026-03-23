import { ConfigurableModuleBuilder } from '@nestjs/common';

import { GraphqlRouterModuleOptions } from './graphql-router.interface';

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GraphqlRouterModuleOptions>().build();

export const GraphqlRouterConfigurableModuleClass = ConfigurableModuleClass;

export const GRAPHQL_ROUTER_OPTIONS = MODULE_OPTIONS_TOKEN;
