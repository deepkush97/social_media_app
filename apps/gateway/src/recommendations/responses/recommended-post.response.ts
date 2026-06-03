import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IRecommendedPost } from '@app/shared/interfaces/social/recommended-post.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class RecommendedPostItem implements IRecommendedPost {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  postId: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class RecommendedPostList extends AppPaginatedDataResponse(RecommendedPostItem) {}

export class RecommendedPostListApiResponse extends ApiResponse(RecommendedPostList) {}
