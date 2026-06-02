import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { PostsModule } from '../posts/posts.module';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [CacheModule, PostsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
