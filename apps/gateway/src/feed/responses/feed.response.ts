import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class FeedItem implements IPostRecommendationItem {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  postId: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class FeedList extends AppPaginatedDataResponse(FeedItem) {}

export class FeedListApiResponse extends ApiResponse(FeedList) {}
