import { Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { PaginationRequest } from '../requests/pagination.request';

import { PostRecommendationListApiResponse } from './responses/post-recommendation.response';
import { UserRecommendationListApiResponse } from './responses/user-recommendation.response';

import { RecommendationsService } from './recommendations.service';

@ApiController('recommendations')
@ApiExtraModels(PaginationRequest)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Authenticated()
  @Get('posts')
  @ApiOperation({ summary: 'get recommended posts for user' })
  @ApiOkResponse({ type: PostRecommendationListApiResponse })
  async handleGetRecommendedPosts(
    @CurrentUser() { id }: ICurrentUser,
    @Query() { page, take }: PaginationRequest,
  ): Promise<PostRecommendationListApiResponse> {
    return this.recommendationsService.getRecommendedPosts(id, page, take);
  }

  @Authenticated()
  @Get('users')
  @ApiOperation({ summary: 'get suggested users to follow' })
  @ApiOkResponse({ type: UserRecommendationListApiResponse })
  async handleGetRecommendedUsers(
    @CurrentUser() { id }: ICurrentUser,
    @Query() { page, take }: PaginationRequest,
  ): Promise<UserRecommendationListApiResponse> {
    return this.recommendationsService.getRecommendedUsers(id, page, take);
  }
}
