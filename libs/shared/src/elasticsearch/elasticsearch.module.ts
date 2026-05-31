import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';

import { ElasticsearchConfigService } from './configurations/elasticsearch-config.service';
import { elasticsearchConfigLoader } from './configurations/loader';

@Module({})
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
          }),
        }),
      ],
      providers: [ElasticsearchConfigService],
      exports: [ElasticsearchService],
    };
  }
}
