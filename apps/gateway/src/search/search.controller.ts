import { Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { SearchRequest } from './requests/search.request';
import { SearchPostListApiResponse } from './responses/search-post-hit.response';
import { SearchTagListApiResponse } from './responses/search-tag-hit.response';
import { SearchUserListApiResponse } from './responses/search-user-hit.response';

import { SearchService } from './search.service';

@ApiController('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Authenticated()
  @Get('posts')
  @ApiOperation({ summary: 'search posts' })
  @ApiQuery({ type: SearchRequest })
  @ApiOkResponse({ type: SearchPostListApiResponse })
  async handleSearchPosts(
    @CurrentUser() _user: ICurrentUser,
    @Query() { q, page, take }: SearchRequest,
  ): Promise<SearchPostListApiResponse> {
    return this.searchService.searchPosts(q, page ?? 1, take ?? 20);
  }

  @Authenticated()
  @Get('users')
  @ApiOperation({ summary: 'search users' })
  @ApiQuery({ type: SearchRequest })
  @ApiOkResponse({ type: SearchUserListApiResponse })
  async handleSearchUsers(
    @CurrentUser() _user: ICurrentUser,
    @Query() { q, page, take }: SearchRequest,
  ): Promise<SearchUserListApiResponse> {
    return this.searchService.searchUsers(q, page ?? 1, take ?? 20);
  }

  @Authenticated()
  @Get('tags')
  @ApiOperation({ summary: 'search tags' })
  @ApiQuery({ type: SearchRequest })
  @ApiOkResponse({ type: SearchTagListApiResponse })
  async handleSearchTags(
    @CurrentUser() _user: ICurrentUser,
    @Query() { q, page, take }: SearchRequest,
  ): Promise<SearchTagListApiResponse> {
    return this.searchService.searchTags(q, page ?? 1, take ?? 20);
  }
}
