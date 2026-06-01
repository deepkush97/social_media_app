import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [CacheModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
