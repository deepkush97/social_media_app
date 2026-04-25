import { Module } from '@nestjs/common';

import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { CacheModule } from '@app/shared/cache/cache.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [BcryptModule, CacheModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
