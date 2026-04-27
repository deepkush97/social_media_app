import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
  ) {}

  private createUserCountsCacheKey(userId: number): string {
    return `user_counts:${userId}`;
  }

  async follow(followerId: number, followingId: number): Promise<IAppResponse<boolean>> {
    const userResult = await this.isUserExists(followingId, 'follow');
    if (userResult.code !== AppCodes.OPERATION_SUCCESS) {
      return userResult;
    }

    const followResult = await this.routerComposite.followUser(
      { followerId, followingId },
      {
        code: 1,
        data: {
          followers: 1,
          followings: 1,
        },
      },
    );
    if (followResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[followResult.code] });
    }

    const data = followResult.data;
    const cacheKey = this.createUserCountsCacheKey(followerId);

    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async unfollow(followerId: number, followingId: number): Promise<IAppResponse<boolean>> {
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
    const cacheKey = this.createUserCountsCacheKey(followerId);

    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async userCounts(userId: number): Promise<IAppResponse<IFollowerFollowingCount>> {
    const cacheKey = this.createUserCountsCacheKey(userId);
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
        code: AppCodes.INVALID_CREDENTIALS,
      });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
