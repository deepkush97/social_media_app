import { Field, ObjectType } from '@nestjs/graphql';

import { IsNumber } from 'class-validator';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import {
  IDecayResult,
  IWeightSnapshot,
} from '@app/shared/interfaces/social/decay-result.interface';

@ObjectType()
export class WeightSnapshotDto implements IWeightSnapshot {
  @Field()
  @IsNumber()
  min: number;

  @Field()
  @IsNumber()
  max: number;

  @Field()
  @IsNumber()
  mean: number;
}

@ObjectType()
export class DecayResultDto implements IDecayResult {
  @Field()
  @IsNumber()
  edgesDecayed: number;

  @Field(() => WeightSnapshotDto)
  before: IWeightSnapshot;

  @Field(() => WeightSnapshotDto)
  after: IWeightSnapshot;
}

@ObjectType()
export class DecayResultOutputDto extends AppGraphqlResponse(DecayResultDto) {}
