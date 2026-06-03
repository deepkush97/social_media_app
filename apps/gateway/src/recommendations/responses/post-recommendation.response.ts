import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class PostRecommendationItem implements IPostRecommendationItem {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  postId: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class PostRecommendationList extends AppPaginatedDataResponse(PostRecommendationItem) {}

export class PostRecommendationListApiResponse extends ApiResponse(PostRecommendationList) {}
