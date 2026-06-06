import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { CommentCreatedEvent } from '@app/shared/events/comment-created.event';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IComment, INewCommentWithUserId } from '@app/shared/interfaces/comment/comment.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { EventBusEmitter } from '@app/shared/nats/event-bus-emitter.service';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';
import { PostsService } from '../posts/posts.service';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class CommentsService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
    private readonly eventBusEmitter: EventBusEmitter,
    private readonly postService: PostsService,
  ) {}

  async createComment({
    content,
    postId,
    userId,
    parentId,
  }: INewCommentWithUserId): Promise<IAppResponse<IComment>> {
    const postResult = await this.postService.findPostById(postId);
    if (postResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: postResult.code });
    }
    const post = postResult.data;

    const result = await this.routerComposite.createComment(
      { userId, postId, content, parentId },
      {
        code: 1,
        data: {
          id: 1,
          postId: 1,
          userId: 1,
          parentId: 1,
          content: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const commentData = result.data;

    await this.cacheService.set(
      RedisFormatter.comment(commentData.id),
      commentData,
      CACHE_TTL_IN_SECONDS,
    );
    await this.cacheService.delAll(RedisFormatter.commentListPattern(postId));

    await this.eventBusEmitter.emit(
      new CommentCreatedEvent({
        id: commentData.id,
        postId: commentData.postId,
        userId,
        content: commentData.content,
        createdAt: commentData.createdAt,
        postOwnerId: post.userId,
        tags: post.tags,
      }),
      this.constructor.name,
    );

    const data: IComment = { ...commentData, status: ContentStatusEnum[commentData.status] };

    return new AppResponse({
      code: AppCodes.OK_CREATED,
      data,
    });
  }

  async findCommentsByPostId(
    postId: number,
    page = 1,
    take = 10,
    status = ContentStatusEnum.ACTIVE,
  ): Promise<IAppResponse<IPaginatedData<IComment>>> {
    const cacheKey = RedisFormatter.commentList(postId, take, page);
    const fromCache = await this.cacheService.get<IPaginatedData<IComment>>(cacheKey);

    if (fromCache) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: fromCache,
      });
    }

    const result = await this.routerComposite.findCommentsByPostId(
      { postId, page, take, status },
      {
        code: 1,
        data: {
          items: {
            id: 1,
            postId: 1,
            userId: 1,
            parentId: 1,
            content: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          meta: {
            lastPage: 1,
            page: 1,
            take: 1,
            total: 1,
          },
        },
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const data = result.data as IPaginatedData<IComment>;
    await this.cacheService.set(cacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  async archiveComment(userId: number, commentId: number): Promise<IAppResponse<boolean>> {
    const commentResult = await this.routerComposite.findCommentById(commentId, {
      code: 1,
      data: {
        id: 1,
        userId: 1,
        postId: 1,
      },
    });
    if (commentResult.code !== AppCodes.OPERATION_SUCCESS || !commentResult.data) {
      return new AppResponse({ code: AppCodes[commentResult.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const comment = commentResult.data as { id: number; userId: number; postId: number };

    if (comment.userId !== userId) {
      const postResult = await this.postService.findPostById(comment.postId);
      if (postResult.code !== AppCodes.OPERATION_SUCCESS || postResult.data?.userId !== userId) {
        return new AppResponse({ code: AppCodes.BAD_REQUEST });
      }
    }

    const deleteResult = await this.routerComposite.archiveComment(commentId, {
      code: 1,
      data: 1,
    });
    if (deleteResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[deleteResult.code] });
    }

    await this.cacheService.del(RedisFormatter.comment(commentId));
    await this.cacheService.delAll(RedisFormatter.commentListPattern(comment.postId));

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS });
  }
}
