import { Module } from '@nestjs/common';

import { ElasticsearchSharedModule } from '@app/shared/elasticsearch/elasticsearch.module';

import { SearchService } from './search.service';
import { SearchSubscriberService } from './search-subscriber.service';

@Module({
  imports: [ElasticsearchSharedModule.register()],
  providers: [SearchService, SearchSubscriberService],
  exports: [SearchService],
})
export class SearchModule {}
