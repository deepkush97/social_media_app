import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';

import { CronJob } from 'cron';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { IDecayResult } from '@app/shared/interfaces/social/decay-result.interface';
import { Neo4jService } from '@app/shared/neo4j/neo4j.service';

@Injectable()
export class WeightDecayService implements OnModuleInit {
  private readonly decayFactor: number;
  private readonly decayFloor: number;

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly logger: AppLoggerService,
  ) {
    this.decayFactor = parseFloat(process.env.WEIGHT_DECAY_FACTOR ?? '0.9');
    this.decayFloor = parseFloat(process.env.WEIGHT_DECAY_FLOOR ?? '1.0');
  }

  async onModuleInit(): Promise<void> {
    const expression = process.env.WEIGHT_DECAY_CRON ?? CronExpression.EVERY_DAY_AT_MIDNIGHT;

    const job = new CronJob(expression, () => {
      void this.decayFollowWeights();
    });

    this.schedulerRegistry.addCronJob('weightDecay', job);
    job.start();

    this.logger.info(`Weight decay cron registered: ${expression}`, {
      context: this.constructor.name,
    });
  }

  async getBaseline(): Promise<{
    count: number;
    min: number;
    max: number;
    mean: number;
  }> {
    return this.neo4jService.executeRead(async (tx) => {
      const result = await tx.run(`
          MATCH ()-[r:FOLLOWS]->()
          WHERE r.weight > 1.0
          RETURN count(r) AS count,
            min(r.weight) AS minW,
            max(r.weight) AS maxW,
            avg(r.weight) AS meanW
        `);
      const record = result.records?.[0];
      return {
        count: record?.get('count')?.toNumber() ?? 0,
        min: record?.get('minW')?.toNumber() ?? 0,
        max: record?.get('maxW')?.toNumber() ?? 0,
        mean: record?.get('meanW')?.toNumber() ?? 0,
      };
    }, WeightDecayService.name);
  }

  async decayFollowWeights(): Promise<IDecayResult> {
    this.logger.info('Running weight decay...', { context: this.constructor.name });

    const before = await this.getBaseline();

    if (before.count === 0) {
      this.logger.info('No edges to decay', { context: this.constructor.name });
      return {
        edgesDecayed: 0,
        before: { min: 0, max: 0, mean: 0 },
        after: { min: 0, max: 0, mean: 0 },
      };
    }

    await this.neo4jService.executeWrite(async (tx) => {
      await tx.run(
        `
          MATCH (u1:User)-[r:FOLLOWS]->(u2:User)
          WHERE r.weight > $floor
            AND (r.lastInteractionAt IS NULL
            OR r.lastInteractionAt < datetime() - duration('P1D'))
          SET r.weight = max($floor, r.weight * $factor)
          `,
        { factor: this.decayFactor, floor: this.decayFloor },
      );
    }, WeightDecayService.name);

    const after = await this.getBaseline();

    const result: IDecayResult = {
      edgesDecayed: before.count - after.count,
      before: { min: before.min, max: before.max, mean: before.mean },
      after: { min: after.min, max: after.max, mean: after.mean },
    };

    this.logger.info(
      `Decayed ${result.edgesDecayed} edges ` +
        `(weight before: μ=${result.before.mean.toFixed(2)}, ` +
        `after: μ=${result.after.mean.toFixed(2)})`,
      {
        context: this.constructor.name,
        data: result,
      },
    );

    return result;
  }
}
