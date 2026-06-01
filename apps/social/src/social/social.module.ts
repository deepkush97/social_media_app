import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Neo4jModule } from '@app/shared/neo4j/neo4j.module';

import { LikeEntity } from './like.entity';
import { SocialService } from './social.service';

@Module({
  imports: [Neo4jModule.forRoot(), TypeOrmModule.forFeature([LikeEntity])],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
