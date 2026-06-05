import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { PostLikedEvent, PostUnlikedEvent } from '@app/shared/events/post-liked.event';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { EventBusEmitter } from '@app/shared/nats/event-bus-emitter.service';

import { PostsService } from '../posts/posts.service';
import { RedisFormatter } from '../redis-formatter';

@Injectable()
export class LikesService {
  constructor(
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
    private readonly eventBusEmitter: EventBusEmitter,
    private readonly postService: PostsService,
    private readonly logger: AppLoggerService,
  ) {}

  async likePost(
    userId: number,
    postId: number,
  ): Promise<IAppResponse<{ id: number; userId: number; postId: number; createdAt: Date }>> {
    const postResult = await this.postService.findPostById(postId);
    if (postResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: postResult.code });
    }

    const result = await this.routerComposite.likePost(
      { userId, postId },
      {
        data: { id: true, userId: true, postId: true, createdAt: true },
        code: true,
      },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS || !result.data) {
      return new AppResponse({ code: AppCodes[result.code ?? AppCodes.INTERNAL_ERROR] });
    }

    const post = postResult.data;

    await Promise.all([
      this.eventBusEmitter.emit(
        new PostLikedEvent({
          userId,
          postOwnerId: post.userId,
          tags: post.tags,
        }),
        this.constructor.name,
      ),
      this.cacheService.delAll(RedisFormatter.postRecommendationPattern(userId)).catch((error) =>
        this.logger.error('Error while removing post recommendation', {
          error,
          context: this.constructor.name,
        }),
      ),
      this.cacheService.delAll(RedisFormatter.userRecommendationPattern(userId)).catch((error) =>
        this.logger.error('Error while removing user recommendation', {
          error,
          context: this.constructor.name,
        }),
      ),
    ]);

    return new AppResponse({ code: AppCodes.OK_CREATED, data: result.data });
  }

  async unlikePost(userId: number, postId: number): Promise<IAppResponse<boolean>> {
    const postResult = await this.postService.findPostById(postId);
    if (postResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: postResult.code });
    }

    const result = await this.routerComposite.unlikePost(
      { userId, postId },
      { data: true, code: true },
    );
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }

    const post = postResult.data;

    await Promise.all([
      this.eventBusEmitter.emit(
        new PostUnlikedEvent({
          userId,
          postOwnerId: post.userId,
          tags: post.tags,
        }),
        this.constructor.name,
      ),
      this.cacheService.delAll(RedisFormatter.postRecommendationPattern(userId)).catch((error) =>
        this.logger.error('Error while removing post recommendation', {
          error,
          context: this.constructor.name,
        }),
      ),
      this.cacheService.delAll(RedisFormatter.userRecommendationPattern(userId)).catch((error) =>
        this.logger.error('Error while removing user recommendation', {
          error,
          context: this.constructor.name,
        }),
      ),
    ]);

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? true });
  }

  async postLikeCount(postId: number): Promise<IAppResponse<number>> {
    const result = await this.routerComposite.postLikeCount(postId, { data: true, code: true });
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? 0 });
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<IAppResponse<boolean>> {
    const result = await this.routerComposite.hasUserLikedPost(userId, postId, {
      data: true,
      code: true,
    });
    if (result.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[result.code] });
    }
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: result.data ?? false });
  }
}
