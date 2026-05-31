import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entities/post.entity';
import { PostTag } from './entities/post-tag.entity';
import { Tag } from './entities/tag.entity';

import { PostsService } from './posts.service';
import { PostsSubscriberService } from './posts-subscriber.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, PostTag])],
  providers: [PostsService, PostsSubscriberService],
  exports: [PostsService],
})
export class PostsModule {}
