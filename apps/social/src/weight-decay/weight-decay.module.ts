import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { Neo4jModule } from '@app/shared/neo4j/neo4j.module';

import { WeightDecayService } from './weight-decay.service';

@Module({
  imports: [Neo4jModule.forRoot(), ScheduleModule.forRoot()],
  providers: [WeightDecayService],
  exports: [WeightDecayService],
})
export class WeightDecayModule {}
