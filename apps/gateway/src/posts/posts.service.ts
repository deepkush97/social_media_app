import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { PostCreatedEvent } from '@app/shared/events/post-created.event';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { INewPost, IPost } from '@app/shared/interfaces/post/post.interface';
import { EventBusClient } from '@app/shared/nats/event-bus-client.service';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';

@Injectable()
export class PostsService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
    private readonly eventBusClient: EventBusClient,
  ) {}

  private createPostCacheKey(postId: number): string {
    return `post:${postId}`;
  }

  private postListCacheKey(
    userId: number,
    take: number,
    page: number,
    status: PostStatusEnum,
  ): string {
    return `posts:${userId}:${take}:${page}:${status}`;
  }

  private deletePostListForUserKey(userId: number): string {
    return `posts:${userId}:*`;
  }

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
          title: 1,
          updatedAt: 1,
        },
      },
    );
    if (createPostResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[createPostResult.code] });
    }

    const postData: IPost = {
      ...createPostResult.data,
      status: PostStatusEnum[createPostResult.data.status],
    };

    await this.cacheService.set(
      this.createPostCacheKey(postData.id),
      postData,
      CACHE_TTL_IN_SECONDS,
    );
    await this.cacheService.delAll(this.deletePostListForUserKey(userId), 3);

    await this.eventBusClient.emit(
      new PostCreatedEvent({
        content: postData.content,
        id: postData.id,
        title: postData.title,
        userId,
        createdAt: postData.createdAt,
      }),
      this.constructor.name,
    );

    return new AppResponse({
      code: AppCodes.OK_CREATED,
      data: postData,
    });
  }

  async archivePost(userId: number, id: number): Promise<IAppResponse<boolean>> {
    const createPostResult = await this.routerComposite.archivePost(id, {
      code: 1,
      data: 1,
    });

    if (createPostResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[createPostResult.code] });
    }

    await this.cacheService.del(this.createPostCacheKey(id));
    await this.cacheService.delAll(this.deletePostListForUserKey(userId), 3);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }

  async findPostById(id: number): Promise<IAppResponse<IPost>> {
    const cacheKey = this.createPostCacheKey(id);
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
      },
    });
    if (postResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[postResult.code] });
    }

    const postData: IPost = {
      ...postResult.data,
      status: PostStatusEnum[postResult.data.status],
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
    status = PostStatusEnum.ACTIVE,
  ): Promise<IAppResponse<IPaginatedData<IPost>>> {
    const postsCacheKey = this.postListCacheKey(userId, take, page, status);

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
    if (postResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[postResult.code] });
    }

    const items: IPost[] = postResult.data.items.map((p) => ({
      ...p,
      status: PostStatusEnum[p.status],
    }));

    const data = { items, meta: postResult.data.meta };
    await this.cacheService.set(postsCacheKey, data, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }
}
