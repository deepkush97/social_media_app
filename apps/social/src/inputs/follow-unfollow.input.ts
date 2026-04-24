import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNumber, IsPositive } from 'class-validator';

import { IsNotEqualTo } from '@app/shared/decorators/class-validators/is-not-equal-to.decorator';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';

@InputType()
export class FollowUnfollowInput implements IFollowUnfollow {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  followerId: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEqualTo('followerId')
  followingId: number;
}
