import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IRecommendedPost } from '@app/shared/interfaces/social/recommended-post.interface';
import { IWhoToFollowUser } from '@app/shared/interfaces/social/who-to-follow-user.interface';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
  ) {}

  private recommendationsCacheKey(userId: number, page: number, take: number): string {
    return `recommendations:${userId}:${page}:${take}`;
  }

  private whoToFollowCacheKey(userId: number, page: number, take: number): string {
    return `whoToFollow:${userId}:${page}:${take}`;
  }

  async getRecommendedPosts(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IRecommendedPost>>> {
    const cacheKey = this.recommendationsCacheKey(userId, page, take);
    const fromCache = await this.cacheService.get<IPaginatedData<IRecommendedPost>>(cacheKey);

    if (fromCache) {
      return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: fromCache });
    }

    const result = await this.routerComposite.recommendedPosts(
      {
        userId,
        take,
        page,
      },
      {
        data: {
          items: { postId: true, score: true },
          meta: { total: true, page: true, lastPage: true, take: true },
        },
        code: true,
      },
    );

    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    await this.cacheService.set(cacheKey, result.data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data });
  }

  async getWhoToFollow(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IWhoToFollowUser>>> {
    const cacheKey = this.whoToFollowCacheKey(userId, page, take);
    const fromCache = await this.cacheService.get<IPaginatedData<IWhoToFollowUser>>(cacheKey);

    if (fromCache) {
      return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: fromCache });
    }

    const result = await this.routerComposite.whoToFollow(
      {
        userId,
        take,
        page,
      },
      {
        data: {
          items: { userId: true, commonFollowers: true, likedPostsScore: true, score: true },
          meta: { total: true, page: true, lastPage: true, take: true },
        },
        code: true,
      },
    );

    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    await this.cacheService.set(cacheKey, result.data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data });
  }
}
