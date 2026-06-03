import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class UserRecommendationItem implements IUserRecommendationItem {
  @Expose()
  @ApiProperty({ description: 'User id' })
  userId: number;

  @Expose()
  @ApiProperty({ description: 'Common followers count' })
  commonFollowers: number;

  @Expose()
  @ApiProperty({ description: 'Liked posts score' })
  likedPostsScore: number;

  @Expose()
  @ApiProperty({ description: 'Combined relevance score' })
  score: number;
}

export class UserRecommendationList extends AppPaginatedDataResponse(UserRecommendationItem) {}

export class UserRecommendationListApiResponse extends ApiResponse(UserRecommendationList) {}
