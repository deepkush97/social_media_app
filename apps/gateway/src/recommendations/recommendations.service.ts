import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IScoredPost } from '@app/shared/interfaces/social/scored-post.interface';
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
  ): Promise<IAppResponse<IPaginatedData<IScoredPost>>> {
    const cacheKey = RedisFormatter.postRecommendation(userId, page, take);
    const fromCache = await this.cacheService.get<IPaginatedData<IScoredPost>>(cacheKey);

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
        code: 1,
        data: {
          meta: {
            lastPage: 1,
            page: 1,
            take: 1,
            total: 1,
          },
          items: {
            content: 1,
            createdAt: 1,
            id: 1,
            image: 1,
            score: 1,
            status: 1,
            tags: 1,
            title: 1,
            updatedAt: 1,
            userId: 1,
          },
        },
      },
    );

    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const { items, meta } = result.data;
    const data: IPaginatedData<IScoredPost> = {
      meta,
      items: items.map((i) => ({ ...i, status: ContentStatusEnum[i.status] })),
    };

    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
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
