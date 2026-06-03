import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { ILike } from '@app/shared/interfaces/like/like.interface';
import { IPaginatedData } from '@app/shared/interfaces/paginated-data.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';
import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';
import { createPaginatedResponse } from '@app/shared/utils/create-paginated-response';

import { LikeInput } from './social/like.input';
import { SocialService } from './social/social.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly socialService: SocialService,
  ) {}

  async follow(input: IFollowUnfollow): Promise<IAppResponse<IFollowerFollowingCount>> {
    try {
      const data = await this.socialService.follow(input);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data,
      });
    } catch (error) {
      this.logger.error('Error while follow operation', { context: this.constructor.name, error });
      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
      });
    }
  }

  async unfollow(input: IFollowUnfollow): Promise<IAppResponse<IFollowerFollowingCount>> {
    try {
      const data = await this.socialService.unfollow(input);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data,
      });
    } catch (error) {
      this.logger.error('Error while unfollow operation', {
        context: this.constructor.name,
        error,
      });
      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
      });
    }
  }

  async userCounts(userId: number): Promise<IAppResponse<IFollowerFollowingCount>> {
    try {
      const data = await this.socialService.userCounts(userId);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data,
      });
    } catch (error) {
      this.logger.error('Error while followerCount operation', {
        context: this.constructor.name,
        error,
      });

      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
      });
    }
  }

  async likePost(input: LikeInput): Promise<IAppResponse<ILike>> {
    const data = await this.socialService.like(input);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async unlikePost(input: LikeInput): Promise<IAppResponse<boolean>> {
    const data = await this.socialService.unlike(input);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async postLikeCount(postId: number): Promise<IAppResponse<number>> {
    const data = await this.socialService.likeCount(postId);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<IAppResponse<boolean>> {
    const liked = await this.socialService.hasLiked(userId, postId);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data: liked });
  }

  async postRecommendation(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IPostRecommendationItem>>> {
    try {
      const limit = take;
      const offset = (page - 1) * take;
      const { items, total } = await this.socialService.postRecommendation(userId, limit, offset);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: createPaginatedResponse(items, total, page, take),
      });
    } catch (error) {
      this.logger.error('Error while postRecommendation operation', {
        context: this.constructor.name,
        error,
      });

      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
      });
    }
  }

  async userRecommendation(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<IAppResponse<IPaginatedData<IUserRecommendationItem>>> {
    try {
      const limit = take;
      const offset = (page - 1) * take;
      const { items, total } = await this.socialService.userRecommendation(userId, limit, offset);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: createPaginatedResponse(items, total, page, take),
      });
    } catch (error) {
      this.logger.error('Error while userRecommendation operation', {
        context: this.constructor.name,
        error,
      });

      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
      });
    }
  }
}
