import { Module } from '@nestjs/common';

import { CacheModule } from '@app/shared/cache/cache.module';

import { PostsModule } from '../posts/posts.module';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [CacheModule, PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
