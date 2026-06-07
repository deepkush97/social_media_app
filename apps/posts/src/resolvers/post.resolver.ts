import { Resolver, ResolveReference } from '@nestjs/graphql';

import { PostOutput } from '../outputs/post.output';
import { PostsService } from '../posts/posts.service';

@Resolver(() => PostOutput)
export class PostResolver {
  constructor(private readonly postsService: PostsService) {}

  @ResolveReference()
  async resolveReference(ref: { __typename: string; id: number }): Promise<PostOutput | null> {
    return this.postsService.findPostById(ref.id);
  }
}
