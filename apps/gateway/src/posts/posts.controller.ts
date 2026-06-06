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
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { CurrentPost, PostExists } from '../guards/post-exists.guard';

import { CreateCommentRequest } from './requests/create-comment.request';
import { CreatePostRequest } from './requests/create-post.request';
import { FindCommentsRequest } from './requests/find-comments.request';
import { FindPostsRequest } from './requests/find-posts.request';
import { CommentItemApiResponse, CommentListApiResponse } from './responses/comment.response';
import { PostItemApiResponse, PostListApiResponse } from './responses/post.response';

import { PostsService } from './posts.service';

@ApiController('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Authenticated()
  @ApiOperation({ summary: 'use to create new post' })
  @Post()
  @ApiBody({
    description: 'Post body',
    type: CreatePostRequest,
  })
  @ApiCreatedResponse({ type: PostItemApiResponse })
  async handleCreatePost(
    @CurrentUser() user: ICurrentUser,
    @Body() body: CreatePostRequest,
  ): Promise<PostItemApiResponse> {
    return this.postService.createPost(user.id, body);
  }

  @Authenticated()
  @Get()
  @ApiOperation({ summary: 'use to get posts list' })
  @ApiQuery({
    type: FindPostsRequest,
    description: 'includes pagination query params',
  })
  @ApiOkResponse({ type: PostListApiResponse })
  handlePostList(
    @CurrentUser() user: ICurrentUser,
    @Query() { page, status, take }: FindPostsRequest,
  ): Promise<PostListApiResponse> {
    {
      return this.postService.findPostsByUserId(user.id, take, page, status);
    }
  }

  @Authenticated()
  @PostExists()
  @Get(':postId')
  @ApiOperation({ summary: 'use to get post' })
  @ApiParam({
    name: 'postId',
    type: Number,
    description: 'id of post',
    example: '1',
  })
  @ApiOkResponse({ type: PostItemApiResponse })
  async getPost(@CurrentPost() data: IPost): Promise<PostItemApiResponse> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  @Authenticated()
  @PostExists()
  @Post('archive/:postId')
  @ApiOperation({ summary: 'use to archive the post' })
  @ApiParam({
    name: 'postId',
    type: Number,
    description: 'id of post',
    example: '1',
  })
  @ApiOkResponse({ type: Boolean })
  async handleArchivePost(
    @CurrentUser() user: ICurrentUser,
    @CurrentPost() post: IPost,
  ): Promise<AppResponse<boolean>> {
    return await this.postService.archivePost(user.id, post);
  }

  @Authenticated()
  @PostExists()
  @Post(':postId/comments')
  @ApiOperation({ summary: 'use to create a comment on a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiBody({ description: 'Comment body', type: CreateCommentRequest })
  @ApiCreatedResponse({ type: CommentItemApiResponse })
  async handleCreateComment(
    @CurrentUser() { id: userId }: ICurrentUser,
    @CurrentPost() post: IPost,
    @Body() { content, parentId }: CreateCommentRequest,
  ): Promise<CommentItemApiResponse> {
    return this.postService.createComment({ content, postId: post.id, userId, parentId }, post);
  }

  @Authenticated()
  @PostExists()
  @Get(':postId/comments')
  @ApiOperation({ summary: 'use to get comments for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'id of post', example: '1' })
  @ApiQuery({ type: FindCommentsRequest, description: 'includes pagination query params' })
  @ApiOkResponse({ type: CommentListApiResponse })
  async handleFindCommentsByPostId(
    @Param('postId', new ParseIntPipe()) postId: number,
    @Query() { page, take, status }: FindCommentsRequest,
  ): Promise<CommentListApiResponse> {
    return this.postService.findCommentsByPostId(postId, page, take, status);
  }

  @Authenticated()
  @PostExists()
  @Post(':postId/comments/archive/:id')
  @ApiOperation({ summary: 'use to archive a comment' })
  @ApiParam({ name: 'id', type: Number, description: 'id of comment', example: '1' })
  @ApiOkResponse()
  async handleArchiveComment(
    @CurrentUser() user: ICurrentUser,
    @CurrentPost() post: IPost,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AppResponse<boolean>> {
    return this.postService.archiveComment(user.id, post, id);
  }
}
