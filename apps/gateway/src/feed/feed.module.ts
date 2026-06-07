import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [CacheModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
