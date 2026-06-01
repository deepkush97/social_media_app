import { Args, Query, Resolver } from '@nestjs/graphql';

import { SearchInput } from './search/inputs/search.input';
import { SearchPostOutputDto } from './search/outputs/search-post.output';
import { SearchTagOutputDto } from './search/outputs/search-tag.output';
import { SearchUserOutputDto } from './search/outputs/search-user.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => SearchPostOutputDto)
  async searchPosts(
    @Args('input') { query, page, take }: SearchInput,
  ): Promise<SearchPostOutputDto> {
    return this.appService.searchPosts(query, page ?? 1, take ?? 20);
  }

  @Query(() => SearchUserOutputDto)
  async searchUsers(
    @Args('input') { query, page, take }: SearchInput,
  ): Promise<SearchUserOutputDto> {
    return await this.appService.searchUsers(query, page ?? 1, take ?? 20);
  }

  @Query(() => SearchTagOutputDto)
  async searchTags(@Args('input') { query, page, take }: SearchInput): Promise<SearchTagOutputDto> {
    return this.appService.searchTags(query, page ?? 1, take ?? 20);
  }
}
