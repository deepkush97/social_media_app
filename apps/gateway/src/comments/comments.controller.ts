import { Body, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { CreateCommentRequest } from './requests/create-comment.request';
import { FindCommentsRequest } from './requests/find-comments.request';
import { CommentItemApiResponse, CommentListApiResponse } from './responses/comment.response';

import { CommentsService } from './comments.service';

@ApiController('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Authenticated()
  @Post(':postId/comments')
  @ApiOperation({ summary: 'use to create a comment on a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiBody({ description: 'Comment body', type: CreateCommentRequest })
  @ApiCreatedResponse({ type: CommentItemApiResponse })
  async handleCreateComment(
    @CurrentUser() { id: userId }: ICurrentUser,
    @Param('postId', new ParseIntPipe()) postId: number,
    @Body() { content, parentId }: CreateCommentRequest,
  ): Promise<CommentItemApiResponse> {
    return this.commentsService.createComment({ content, postId, userId, parentId });
  }

  @Authenticated()
  @Get(':postId/comments')
  @ApiOperation({ summary: 'use to get comments for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiQuery({ type: FindCommentsRequest, description: 'includes pagination query params' })
  @ApiOkResponse({ type: CommentListApiResponse })
  async handleFindCommentsByPostId(
    @Param('postId', new ParseIntPipe()) postId: number,
    @Query() { page, take, status }: FindCommentsRequest,
  ): Promise<CommentListApiResponse> {
    return this.commentsService.findCommentsByPostId(postId, page, take, status);
  }

  @Authenticated()
  @Post(':postId/comments/archive/:id')
  @ApiOperation({ summary: 'use to archive a comment' })
  @ApiParam({ name: 'id', type: Number, description: 'id of comment', example: '1' })
  @ApiOkResponse()
  async handleArchiveComment(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AppResponse<boolean>> {
    return this.commentsService.archiveComment(user.id, id);
  }
}
