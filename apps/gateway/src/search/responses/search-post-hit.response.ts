import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ISearchPostHit } from '@app/shared/interfaces/search/search-post-hit.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class SearchPostHitItem implements ISearchPostHit {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Title' })
  title: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Content' })
  content?: string;

  @Expose()
  @ApiProperty({ description: 'User id' })
  userId: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;

  @Expose()
  @ApiProperty({ description: 'tags', isArray: true })
  tags?: string[];
}

export class SearchPostList extends AppPaginatedDataResponse(SearchPostHitItem) {}
export class SearchPostListApiResponse extends ApiResponse(SearchPostList) {}
