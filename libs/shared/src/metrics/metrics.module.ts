import { Global, Module } from '@nestjs/common';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { providers } from './metrics.configuration';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
    }),
  ],
  providers: providers,
  exports: providers,
})
export class AppMetricsModule {}
