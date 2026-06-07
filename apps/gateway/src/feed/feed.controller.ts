import { Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { PaginationRequest } from '../requests/pagination.request';

import { FeedListApiResponse } from './responses/feed.response';

import { FeedService } from './feed.service';

@ApiController('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Authenticated()
  @Get()
  @ApiOperation({ summary: 'get feed for the authenticated user' })
  @ApiOkResponse({ type: FeedListApiResponse })
  async handleGetFeed(
    @CurrentUser() { id }: ICurrentUser,
    @Query() { page, take }: PaginationRequest,
  ): Promise<FeedListApiResponse> {
    return this.feedService.getFeed(id, page, take);
  }
}
