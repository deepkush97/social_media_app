import { Field, Int, ObjectType } from '@nestjs/graphql';

import { IsNumber, IsPositive } from 'class-validator';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';

@ObjectType()
export class FollowerFollowingCountDto implements IFollowerFollowingCount {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  followers: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  followings: number;
}

@ObjectType()
export class UserCountsDto extends AppGraphqlResponse(FollowerFollowingCountDto) {}
