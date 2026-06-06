import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { CommentCreatedEvent } from '@app/shared/events/comment-created.event';
import { PostCreatedEvent } from '@app/shared/events/post-created.event';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IComment, INewCommentWithUserId } from '@app/shared/interfaces/comment/comment.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { INewPost, IPost } from '@app/shared/interfaces/post/post.interface';
import { EventBusEmitter } from '@app/shared/nats/event-bus-emitter.service';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class PostsService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
    private readonly eventBusEmitter: EventBusEmitter,
  ) {}

  async createPost(userId: number, input: INewPost): Promise<IAppResponse<IPost>> {
    const createPostResult = await this.routerComposite.createPost(
      { ...input, userId },
      {
        code: 1,
        data: {
          id: 1,
          createdAt: 1,
          content: 1,
          image: 1,
          status: 1,
          tags: 1,
          title: 1,
          updatedAt: 1,
          userId: 1,
        },
      },
    );
    if (createPostResult.code !== AppCodes.OPERATION_SUCCESS || !createPostResult.data) {
      return new AppResponse({ code: AppCodes[createPostResult.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const postData: IPost = {
      ...createPostResult.data,
      status: ContentStatusEnum[createPostResult.data.status],
    };

    await this.cacheService.set(RedisFormatter.post(postData.id), postData, CACHE_TTL_IN_SECONDS);
    await this.cacheService.delAll(RedisFormatter.postListPattern(userId));

    await this.eventBusEmitter.emit(
      new PostCreatedEvent({
        content: postData.content,
        id: postData.id,
        title: postData.title,
        userId,
        createdAt: postData.createdAt,
        tags: postData.tags,
      }),
      this.constructor.name,
    );

    return new AppResponse({
      code: AppCodes.OK_CREATED,
      data: postData,
    });
  }

  async archivePost(userId: number, post: IPost): Promise<IAppResponse<boolean>> {
    if (post.userId !== userId) {
      return new AppResponse({
        code: AppCodes.BAD_REQUEST,
      });
    }

    const createPostResult = await this.routerComposite.archivePost(post.id, {
      code: 1,
      data: 1,
    });

    if (createPostResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[createPostResult.code] });
    }

    await this.cacheService.del(RedisFormatter.post(post.id));
    await this.cacheService.delAll(RedisFormatter.postListPattern(userId));

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async findPostById(id: number): Promise<IAppResponse<IPost>> {
    const cacheKey = RedisFormatter.post(id);
    const fromCache = await this.cacheService.get<IPost>(cacheKey);

    if (fromCache) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: fromCache,
      });
    }

    const postResult = await this.routerComposite.findPostById(id, {
      code: 1,
      data: {
        id: 1,
        createdAt: 1,
        content: 1,
        image: 1,
        status: 1,
        title: 1,
        updatedAt: 1,
        userId: 1,
        tags: 1,
      },
    });
    if (postResult.code !== AppCodes.OPERATION_SUCCESS || !postResult.data) {
      return new AppResponse({ code: AppCodes[postResult.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const postData: IPost = {
      ...postResult.data,
      status: ContentStatusEnum[postResult.data.status],
    };

    await this.cacheService.set(cacheKey, postData, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: postData,
    });
  }

  async findPostsByUserId(
    userId: number,
    take = 10,
    page = 1,
    status = ContentStatusEnum.ACTIVE,
  ): Promise<IAppResponse<IPaginatedData<IPost>>> {
    const postsCacheKey = RedisFormatter.postList(userId, take, page, status);

    const fromCache = await this.cacheService.get<IPaginatedData<IPost>>(postsCacheKey);

    if (fromCache) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: fromCache,
      });
    }

    const postResult = await this.routerComposite.findPostsByUserId(
      { userId, page, take, status },
      {
        code: 1,
        data: {
          items: {
            id: 1,
            createdAt: 1,
            content: 1,
            image: 1,
            status: 1,
            userId: 1,
            title: 1,
            updatedAt: 1,
            tags: 1,
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
    if (postResult.code !== AppCodes.OPERATION_SUCCESS || !postResult.data) {
      return new AppResponse({ code: AppCodes[postResult.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const items: IPost[] = postResult.data.items.map((p) => ({
      ...p,
      status: ContentStatusEnum[p.status],
    }));

    const data = { items, meta: postResult.data.meta };
    await this.cacheService.set(postsCacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  async createComment(
    { content, postId, userId, parentId }: INewCommentWithUserId,
    post: IPost,
  ): Promise<IAppResponse<IComment>> {
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

  async archiveComment(
    userId: number,
    post: IPost,
    commentId: number,
  ): Promise<IAppResponse<boolean>> {
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

    if (comment.userId !== userId && post.userId !== userId) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
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
