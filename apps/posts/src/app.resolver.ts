import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreatePostInput } from './inputs/create-post.input';
import { PostOutputDto } from './outputs/post.output';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Mutation(() => PostOutputDto)
  async createPost(@Args('input') input: CreatePostInput): Promise<PostOutputDto> {
    return this.appService.createPost(input);
  }
}
