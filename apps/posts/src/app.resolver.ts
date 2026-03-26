import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { BooleanOutputDto } from '@app/shared/boolean.output';

import { CreatePostInput } from './inputs/create-post.input';
import { PostsPaginationInput } from './inputs/posts-pagination.input';
import { PostListOutputDto, PostOutputDto } from './outputs/post.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => PostOutputDto)
  async createPost(@Args('input') input: CreatePostInput): Promise<PostOutputDto> {
    return this.appService.createPost(input);
  }

  @Query(() => PostOutputDto)
  async findPostById(@Args('id', { type: () => Int }) id: number): Promise<PostOutputDto> {
    return this.appService.findPostById(id);
  }

  @Query(() => PostListOutputDto)
  async findPostsByUserId(
    @Args('input') { userId, page, take, status }: PostsPaginationInput,
  ): Promise<PostListOutputDto> {
    return this.appService.findPostsByUserId(userId, status, {
      take,
      page,
    });
  }

  @Mutation(() => BooleanOutputDto)
  async archivePost(@Args('id', { type: () => Int }) id: number): Promise<BooleanOutputDto> {
    return this.appService.archivePost(id);
  }
}
