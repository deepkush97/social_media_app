import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BooleanOutputDto } from '@app/shared/boolean.output';

import { FollowUnfollowInput } from './inputs/follow-unfollow.input';
import { UserCountsDto } from './outputs/user-counts.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => BooleanOutputDto)
  async follow(@Args('input') input: FollowUnfollowInput): Promise<BooleanOutputDto> {
    return this.appService.follow(input);
  }

  @Mutation(() => BooleanOutputDto)
  async unfollow(@Args('input') input: FollowUnfollowInput): Promise<BooleanOutputDto> {
    return this.appService.unfollow(input);
  }

  @Query(() => UserCountsDto)
  async userCounts(@Args('id', { type: () => Int }) userId: number): Promise<UserCountsDto> {
    return this.appService.userCounts(userId);
  }
}
