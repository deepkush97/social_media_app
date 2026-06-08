import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IScoredPostIdItem } from '@app/shared/interfaces/social/scored-post-id.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class PostRecommendationItem implements IScoredPostIdItem {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class PostRecommendationList extends AppPaginatedDataResponse(PostRecommendationItem) {}

export class PostRecommendationListApiResponse extends ApiResponse(PostRecommendationList) {}
