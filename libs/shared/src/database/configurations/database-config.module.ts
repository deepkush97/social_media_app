import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseConfigService } from './database-config.service';
import { dbConfigLoader } from './loader';

@Module({
  imports: [ConfigModule.forFeature(dbConfigLoader)],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
