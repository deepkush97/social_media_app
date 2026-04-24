import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IFollowUnfollow } from '@app/shared/interfaces/social/follow-unfollow.interface';

import { SocialService } from './social/social.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly socialService: SocialService,
  ) {}

  async follow(input: IFollowUnfollow): Promise<IAppResponse<boolean>> {
    try {
      await this.socialService.follow(input);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: true,
      });
    } catch (error) {
      this.logger.error('Error while follow operation', { context: this.constructor.name, error });
      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
        data: false,
      });
    }
  }

  async unfollow(input: IFollowUnfollow): Promise<IAppResponse<boolean>> {
    try {
      await this.socialService.unfollow(input);

      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data: true,
      });
    } catch (error) {
      this.logger.error('Error while unfollow operation', {
        context: this.constructor.name,
        error,
      });
      return new AppResponse({
        code: AppCodes.INTERNAL_ERROR,
        data: false,
      });
    }
  }

  async followerCount(userId: number): Promise<IAppResponse<number>> {
    try {
      const data = await this.socialService.followerCount(userId);

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
