import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { ISearchPostHit } from '@app/shared/interfaces/search/search-post-hit.interface';
import { ISearchTagHit } from '@app/shared/interfaces/search/search-tag-hit.interface';
import { ISearchUserHitOutput } from '@app/shared/interfaces/search/search-user-hit-output.interface';

@Injectable()
export class SearchService {
  constructor(private readonly routerComposite: GraphqlRouterComposite) {}

  async searchPosts(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchPostHit>>> {
    const result = await this.routerComposite.searchPosts(
      { query, page, take },
      {
        data: {
          items: { id: true, title: true, content: true, userId: true, score: true, tags: true },
          meta: { total: true, page: true, lastPage: true, take: true },
        },
        code: true,
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data });
  }

  async searchUsers(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchUserHitOutput>>> {
    const result = await this.routerComposite.searchUsers(
      { query, page, take },
      {
        data: {
          items: { id: true, email: true, name: true, score: true },
          meta: { total: true, page: true, lastPage: true, take: true },
        },
        code: true,
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data });
  }

  async searchTags(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchTagHit>>> {
    const result = await this.routerComposite.searchTags(
      { query, page, take },
      {
        data: {
          items: { name: true, score: true, id: true },
          meta: { total: true, page: true, lastPage: true, take: true },
        },
        code: true,
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data });
  }
}
