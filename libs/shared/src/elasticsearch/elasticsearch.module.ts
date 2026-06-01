import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ElasticsearchConfigService } from './configurations/elasticsearch-config.service';
import { elasticsearchConfigLoader } from './configurations/loader';

@Global()
@Module({
  imports: [ConfigModule.forFeature(elasticsearchConfigLoader)],
  providers: [ElasticsearchConfigService],
  exports: [ElasticsearchConfigService],
})
export class ElasticsearchSharedModule {
  static register(): DynamicModule {
    return {
      module: ElasticsearchSharedModule,
      imports: [
        ConfigModule.forFeature(elasticsearchConfigLoader),
        ElasticsearchModule.registerAsync({
          inject: [ElasticsearchConfigService],
          useFactory: (configService: ElasticsearchConfigService) => ({
            node: configService.url,
            requestTimeout: 50_000,
            maxRetries: 2,
          }),
        }),
      ],
      exports: [ElasticsearchModule],
    };
  }
}
