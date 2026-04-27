import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';
import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';

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
}
