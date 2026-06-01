import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { ISearchPostHit } from '@app/shared/interfaces/search/search-post-hit.interface';
import { ISearchTagHit } from '@app/shared/interfaces/search/search-tag-hit.interface';
import { ISearchUserHit } from '@app/shared/interfaces/search/search-user-hit.interface';

import { SearchService } from './search/search.service';

@Injectable()
export class AppService {
  constructor(private readonly searchService: SearchService) {}

  async searchPosts(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchPostHit>>> {
    const data = await this.searchService.searchPosts(query, page, take);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async searchUsers(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchUserHit>>> {
    const data = await this.searchService.searchUsers(query, page, take);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async searchTags(
    query: string,
    page: number,
    take: number,
  ): Promise<IAppResponse<IPaginatedData<ISearchTagHit>>> {
    const data = await this.searchService.searchTags(query, page, take);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }
}
