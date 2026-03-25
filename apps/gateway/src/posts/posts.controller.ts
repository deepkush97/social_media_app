import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { CreatePostRequest } from './requests/create-post.request';
import { PostListResponse, PostResponse } from './responses/post.response';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Authenticated()
  @Post()
  async handleCreatePost(
    @CurrentUser() user: ICurrentUser,
    @Body() body: CreatePostRequest,
  ): Promise<AppResponse<PostResponse>> {
    return this.postService.createPost(user.id, body);
  }

  @Authenticated()
  @Get()
  handlePostList(
    @CurrentUser() user: ICurrentUser,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    //TODO: Create the param class to validate and also add status to filter
  ): Promise<AppResponse<PostListResponse>> {
    {
      return this.postService.findPostsByUserId(user.id, take, page);
    }
  }

  @Authenticated()
  @Get(':id')
  async getPost(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: true })) id: number,
  ): Promise<AppResponse<PostResponse>> {
    return await this.postService.findPostById(user.id, id);
  }

  @Authenticated()
  @Post('archive/:id')
  async handleArchivePost(
    @CurrentUser() user: ICurrentUser,
    @Param('id', new ParseIntPipe({ optional: true })) id: number,
  ): Promise<AppResponse<boolean>> {
    return await this.postService.archivePost(user.id, id);
  }
}
