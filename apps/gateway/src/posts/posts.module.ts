import { Module } from '@nestjs/common';

import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { CacheModule } from '@app/shared/cache/cache.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [BcryptModule, CacheModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
