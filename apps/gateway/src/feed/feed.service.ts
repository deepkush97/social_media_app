import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';

import { FEED_CACHE_TTL_IN_SECONDS } from '../app.constant';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class FeedService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
  ) {}

  async getFeed(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IPostRecommendationItem>>> {
    const cacheKey = RedisFormatter.feed(userId, page, take);
    const fromCache =
      await this.cacheService.get<IPaginatedData<IPostRecommendationItem>>(cacheKey);

    if (fromCache) {
      return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: fromCache });
    }

    const result = await this.routerComposite.feed({ userId, take, page }, {});

    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: { items: [], meta: { total: 0, page, lastPage: 0, take } },
      });
    }

    const data = result.data;

    await this.cacheService.set(cacheKey, data, FEED_CACHE_TTL_IN_SECONDS);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }
}
