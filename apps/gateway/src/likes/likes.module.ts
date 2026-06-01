import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [CacheModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
