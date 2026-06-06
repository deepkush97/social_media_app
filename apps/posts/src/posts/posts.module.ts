import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';

import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment])],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
