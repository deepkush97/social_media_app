import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

import { PostsService } from '../posts/posts.service';

@Injectable()
export class PostExistsGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = parseInt(request.params.postId, 10);

    if (isNaN(postId)) {
      throw new NotFoundException('Invalid post id');
    }

    const result = await this.postsService.findPostById(postId);

    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    request.post = result.data;

    return true;
  }
}

export function PostExists(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(PostExistsGuard));
}

export const CurrentPost = createParamDecorator((_: unknown, ctx: ExecutionContext): IPost => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.post) {
    throw new NotFoundException('Post not resolved — did you forget @PostExists()?');
  }

  return request.post;
});
