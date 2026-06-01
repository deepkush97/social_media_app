import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BooleanOutputDto } from '@app/shared/boolean.output';
import { NumberOutputDto } from '@app/shared/number.output';

import { FollowUnfollowInput } from './inputs/follow-unfollow.input';
import { UserCountsDto } from './outputs/user-counts.output';
import { LikeInput } from './social/like.input';
import { InteractionOutputDto } from './social/like.output';

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

  @Mutation(() => InteractionOutputDto)
  async likePost(@Args('input') input: LikeInput): Promise<InteractionOutputDto> {
    return this.appService.likePost(input);
  }

  @Mutation(() => BooleanOutputDto)
  async unlikePost(@Args('input') input: LikeInput): Promise<BooleanOutputDto> {
    return this.appService.unlikePost(input);
  }

  @Query(() => NumberOutputDto)
  async postLikeCount(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<NumberOutputDto> {
    return this.appService.postLikeCount(postId);
  }

  @Query(() => BooleanOutputDto)
  async hasUserLikedPost(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<BooleanOutputDto> {
    return this.appService.hasUserLikedPost(userId, postId);
  }
}
