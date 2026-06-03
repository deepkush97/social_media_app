import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IRecommendedPost } from '@app/shared/interfaces/social/recommended-post.interface';

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
        page: page - 1,
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

    const data: IPaginatedData<IRecommendedPost> = {
      items: result.data.items,
      meta: {
        total: result.data.meta.total,
        page: result.data.meta.page + 1,
        lastPage: result.data.meta.lastPage + 1,
        take: result.data.meta.take,
      },
    };

    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }
}
