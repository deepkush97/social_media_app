import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ApiResponse } from '../../responses/app-combined.response';

@Exclude()
export class LikeResponse {
  @Expose()
  @ApiProperty({ description: 'Like id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'User id' })
  userId: number;

  @Expose()
  @ApiProperty({ description: 'Post id' })
  postId: number;

  @Expose()
  @ApiProperty({ description: 'Created at' })
  createdAt: Date;
}

export class LikeApiResponse extends ApiResponse(LikeResponse) {}
