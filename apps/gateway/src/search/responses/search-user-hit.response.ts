import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ISearchUserHitOutput } from '@app/shared/interfaces/search/search-user-hit-output.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class SearchUserHitItem implements ISearchUserHitOutput {
  @Expose()
  @ApiProperty({ description: 'User id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Email' })
  email: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Name' })
  name?: string;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;
}

export class SearchUserList extends AppPaginatedDataResponse(SearchUserHitItem) {}
export class SearchUserListApiResponse extends ApiResponse(SearchUserList) {}
