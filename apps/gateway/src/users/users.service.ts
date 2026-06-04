import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { FollowSource } from '@app/shared/enums/follow-source.enum';
import { UserFollowedEvent, UserUnfollowedEvent } from '@app/shared/events/user-followed.event';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
import { EventBusClient } from '@app/shared/nats/event-bus-client.service';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
    private readonly eventBusClient: EventBusClient,
  ) {}

  async follow(
    followerId: number,
    followingId: number,
    source?: FollowSource,
  ): Promise<IAppResponse<boolean>> {
    if (followerId === followingId) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    const userResult = await this.isUserExists(followingId, 'follow');
    if (userResult.code !== AppCodes.OPERATION_SUCCESS) {
      return userResult;
    }

    const followResult = await this.routerComposite.followUser(
      { followerId, followingId, source },
      {
        code: 1,
        data: {
          followers: 1,
          followings: 1,
        },
      },
    );
    if (followResult.code !== AppCodes.OPERATION_SUCCESS || !followResult.data) {
      return new AppResponse({ code: AppCodes[followResult.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const data = followResult.data;
    const targetCacheKey = RedisFormatter.userCounts(followingId);
    const followerCacheKey = RedisFormatter.userCounts(followerId);

    await this.cacheService.set(targetCacheKey, data, CACHE_TTL_IN_SECONDS);
    await this.cacheService.del(followerCacheKey);

    await Promise.all([
      this.eventBusClient.emit(
        new UserFollowedEvent({
          followerId,
          followingId,
          createdAt: new Date(),
        }),
        this.constructor.name,
      ),
      this.cacheService
        .delAll(RedisFormatter.postRecommendationPattern(followerId))
        .catch((error) =>
          this.logger.error('Error while removing post recommendation', {
            error,
            context: this.constructor.name,
          }),
        ),
      this.cacheService
        .delAll(RedisFormatter.userRecommendationPattern(followerId))
        .catch((error) =>
          this.logger.error('Error while removing user recommendation', {
            error,
            context: this.constructor.name,
          }),
        ),
    ]);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async unfollow(followerId: number, followingId: number): Promise<IAppResponse<boolean>> {
    if (followerId === followingId) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    const userResult = await this.isUserExists(followingId, 'unfollow');
    if (userResult.code !== AppCodes.OPERATION_SUCCESS) {
      return userResult;
    }

    const unfollowResult = await this.routerComposite.unfollowUser(
      { followerId, followingId },
      {
        code: 1,
        data: {
          followers: 1,
          followings: 1,
        },
      },
    );
    if (unfollowResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[unfollowResult.code] });
    }

    const data = unfollowResult.data;
    const targetCacheKey = RedisFormatter.userCounts(followingId);
    const followerCacheKey = RedisFormatter.userCounts(followerId);

    await this.cacheService.set(targetCacheKey, data, CACHE_TTL_IN_SECONDS);
    await this.cacheService.del(followerCacheKey);

    await Promise.all([
      this.eventBusClient.emit(
        new UserUnfollowedEvent({
          followerId,
          followingId,
          createdAt: new Date(),
        }),
        this.constructor.name,
      ),
      this.cacheService
        .delAll(RedisFormatter.postRecommendationPattern(followerId))
        .catch((error) =>
          this.logger.error('Error while removing post recommendation', {
            error,
            context: this.constructor.name,
          }),
        ),
      this.cacheService
        .delAll(RedisFormatter.userRecommendationPattern(followerId))
        .catch((error) =>
          this.logger.error('Error while removing user recommendation', {
            error,
            context: this.constructor.name,
          }),
        ),
    ]);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async userCounts(userId: number): Promise<IAppResponse<IFollowerFollowingCount>> {
    const cacheKey = RedisFormatter.userCounts(userId);
    const fromCache = await this.cacheService.get<IFollowerFollowingCount>(cacheKey);

    if (fromCache) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: fromCache,
      });
    }

    const userCountsResult = await this.routerComposite.userCounts(userId, {
      code: 1,
      data: {
        followers: 1,
        followings: 1,
      },
    });

    if (userCountsResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[userCountsResult.code] });
    }

    const data = userCountsResult.data;

    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  private async isUserExists(
    id: number,
    caller: 'follow' | 'unfollow',
  ): Promise<AppResponse<boolean>> {
    const followingUserResult = await this.routerComposite.findUserById(id, {
      code: 1,
      data: {
        id: 1,
      },
    });

    if (followingUserResult.code !== AppCodes.OPERATION_SUCCESS) {
      this.logger.warn(`User not found while ${caller} operation`, {
        context: this.constructor.name,
        data: id,
      });
      return new AppResponse({
        code: AppCodes.BAD_REQUEST,
      });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
