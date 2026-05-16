import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class PostItem implements IPost {
  @ApiProperty({ description: 'Post id' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Post title' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Post content' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'Post image', required: false })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'User id' })
  @Expose()
  userId: number;

  @ApiProperty({ description: 'Post creation date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Post update date' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Post status', enum: PostStatusEnum })
  @Expose()
  status: PostStatusEnum;
}

export class PostItemApiResponse extends ApiResponse(PostItem) {}

export class PostList extends AppPaginatedDataResponse(PostItem) {}

export class PostListApiResponse extends ApiResponse(PostList) {}
