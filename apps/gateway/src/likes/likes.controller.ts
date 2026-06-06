import { Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';
import { CurrentPost, PostExists } from 'apps/gateway/src/guards/post-exists.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import type { IPost } from '@app/shared/interfaces/post/post.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { LikeApiResponse } from './responses/like.response';

import { LikesService } from './likes.service';

@ApiController('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Authenticated()
  @PostExists()
  @Post('/:postId/like')
  @ApiOperation({ summary: 'use to like a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiOkResponse({ type: LikeApiResponse })
  async handleLikePost(
    @CurrentUser() user: ICurrentUser,
    @CurrentPost() post: IPost,
  ): Promise<LikeApiResponse> {
    return this.likesService.likePost(user.id, post);
  }

  @Authenticated()
  @PostExists()
  @Post('/:postId/unlike')
  @ApiOperation({ summary: 'use to unlike a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiOkResponse()
  async handleUnlikePost(
    @CurrentUser() user: ICurrentUser,
    @CurrentPost() post: IPost,
  ): Promise<AppResponse<boolean>> {
    return this.likesService.unlikePost(user.id, post);
  }

  @Authenticated()
  @PostExists()
  @Get('/:postId/count')
  @ApiOperation({ summary: 'use to get like count of a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiOkResponse()
  async handlePostLikeCount(
    @Param('postId', new ParseIntPipe()) postId: number,
  ): Promise<AppResponse<number>> {
    return this.likesService.postLikeCount(postId);
  }

  @Authenticated()
  @PostExists()
  @Get('/:postId/check')
  @ApiOperation({ summary: 'use to check if user has liked a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiOkResponse()
  async handleHasUserLiked(
    @CurrentUser() user: ICurrentUser,
    @Param('postId', new ParseIntPipe()) postId: number,
  ): Promise<AppResponse<boolean>> {
    return this.likesService.hasUserLikedPost(user.id, postId);
  }
}
