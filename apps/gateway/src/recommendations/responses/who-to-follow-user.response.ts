import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IWhoToFollowUser } from '@app/shared/interfaces/social/who-to-follow-user.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class WhoToFollowUserItem implements IWhoToFollowUser {
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

export class WhoToFollowUserList extends AppPaginatedDataResponse(WhoToFollowUserItem) {}

export class WhoToFollowListApiResponse extends ApiResponse(WhoToFollowUserList) {}
