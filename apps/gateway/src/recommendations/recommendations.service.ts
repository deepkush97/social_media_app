import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';
import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
  ) {}

  async getRecommendedPosts(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IPostRecommendationItem>>> {
    const cacheKey = RedisFormatter.postRecommendation(userId, page, take);
    const fromCache =
      await this.cacheService.get<IPaginatedData<IPostRecommendationItem>>(cacheKey);

    if (fromCache) {
      return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: fromCache });
    }

    const result = await this.routerComposite.postRecommendation(
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

  async getRecommendedUsers(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IUserRecommendationItem>>> {
    const cacheKey = RedisFormatter.userRecommendation(userId, page, take);
    const fromCache =
      await this.cacheService.get<IPaginatedData<IUserRecommendationItem>>(cacheKey);

    if (fromCache) {
      return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: fromCache });
    }

    const result = await this.routerComposite.userRecommendation(
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
