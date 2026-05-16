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

import { CreatePostRequest } from './requests/create-post.request';
import { FindPostsRequest } from './requests/find-posts.request';
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
  @Get(':id')
  @ApiOperation({ summary: 'use to get post' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id of post',
    example: '1',
  })
  @ApiOkResponse({ type: PostItemApiResponse })
  async getPost(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: true })) id: number,
  ): Promise<PostItemApiResponse> {
    return await this.postService.findPostById(user.id, id);
  }

  @Authenticated()
  @Post('archive/:id')
  @ApiOperation({ summary: 'use to archive the post' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id of post',
    example: '1',
  })
  @ApiOkResponse({ type: Boolean })
  async handleArchivePost(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.postService.archivePost(user.id, id);
  }
}
