import { Module } from '@nestjs/common';

import { Neo4jModule } from '@app/shared/neo4j/neo4j.module';

import { SocialService } from './social.service';

@Module({
  imports: [Neo4jModule.forRoot()],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
