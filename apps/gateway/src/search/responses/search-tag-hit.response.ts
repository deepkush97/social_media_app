import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ISearchTagHit } from '@app/shared/interfaces/search/search-tag-hit.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class SearchTagHitItem implements ISearchTagHit {
  @Expose()
  @ApiProperty({ description: 'Tag id' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Tag name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class SearchTagList extends AppPaginatedDataResponse(SearchTagHitItem) {}
export class SearchTagListApiResponse extends ApiResponse(SearchTagList) {}
