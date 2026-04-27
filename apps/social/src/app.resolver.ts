import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FollowUnfollowInput } from './inputs/follow-unfollow.input';
import { UserCountsDto } from './outputs/user-counts.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => UserCountsDto)
  async follow(@Args('input') input: FollowUnfollowInput): Promise<UserCountsDto> {
    return this.appService.follow(input);
  }

  @Mutation(() => UserCountsDto)
  async unfollow(@Args('input') input: FollowUnfollowInput): Promise<UserCountsDto> {
    return this.appService.unfollow(input);
  }

  @Query(() => UserCountsDto)
  async userCounts(@Args('id', { type: () => Int }) userId: number): Promise<UserCountsDto> {
    return this.appService.userCounts(userId);
  }
}
