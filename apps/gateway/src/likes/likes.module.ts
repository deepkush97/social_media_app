import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { PostExistsGuard } from '../guards/post-exists.guard';
import { PostsModule } from '../posts/posts.module';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [CacheModule, PostsModule],
  controllers: [LikesController],
  providers: [LikesService, PostExistsGuard],
})
export class LikesModule {}
