import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { IFollowerFollowingCount } from '@app/shared/interfaces/social/follower-following-count.interface';

import { ApiResponse } from '../../responses/app-combined.response';

@Exclude()
export class UsersCountResponse implements IFollowerFollowingCount {
  @Expose()
  @ApiProperty({ description: 'Followers count' })
  followers: number;

  @Expose()
  @ApiProperty({ description: 'Followings count' })
  followings: number;
}

export class UsersCountApiResponse extends ApiResponse(UsersCountResponse) {}
