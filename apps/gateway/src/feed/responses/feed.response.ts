import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IScoredPost } from '@app/shared/interfaces/social/scored-post.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class FeedItem implements IScoredPost {
  @Expose()
  @ApiProperty({ description: 'Post id' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Relevance score' })
  score: number;

  @Expose()
  @ApiProperty({ description: 'Post title' })
  title: string;

  @Expose()
  @ApiProperty({ description: 'Post content' })
  content: string;

  @Expose()
  @ApiProperty({ description: 'Post image', nullable: true })
  image?: string;

  @Expose()
  @ApiProperty({ description: 'Post tags' })
  tags: string[];

  @Expose()
  @ApiProperty({ description: 'Author user id' })
  userId: number;

  @Expose()
  @ApiProperty({ description: 'Post status', enum: ContentStatusEnum })
  status: ContentStatusEnum;

  @Expose()
  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class FeedList extends AppPaginatedDataResponse(FeedItem) {}

export class FeedListApiResponse extends ApiResponse(FeedList) {}
