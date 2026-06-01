import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { SearchPostOutputDto } from './search/outputs/search-post.output';
import { SearchUserOutputDto } from './search/outputs/search-user.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => SearchPostOutputDto)
  async searchPosts(
    @Args('query') query: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<SearchPostOutputDto> {
    return this.appService.searchPosts(
      query,
      page ?? 1,
      take ?? 20,
    ) as unknown as SearchPostOutputDto;
  }

  @Query(() => SearchUserOutputDto)
  async searchUsers(
    @Args('query') query: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<SearchUserOutputDto> {
    return this.appService.searchUsers(
      query,
      page ?? 1,
      take ?? 20,
    ) as unknown as SearchUserOutputDto;
  }

  @Query(() => SearchUserOutputDto)
  async searchTags(
    @Args('query') query: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<SearchUserOutputDto> {
    return this.appService.searchTags(
      query,
      page ?? 1,
      take ?? 20,
    ) as unknown as SearchUserOutputDto;
  }
}
