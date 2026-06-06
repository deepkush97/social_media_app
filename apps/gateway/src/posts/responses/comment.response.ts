import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IComment } from '@app/shared/interfaces/comment/comment.interface';

import { ApiResponse } from '../../responses/app-combined.response';
import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class CommentItem implements IComment {
  @ApiProperty({ description: 'Comment id' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Post id' })
  @Expose()
  postId: number;

  @ApiProperty({ description: 'User id' })
  @Expose()
  userId: number;

  @ApiProperty({ description: 'Parent comment id', required: false })
  @Expose()
  parentId?: number;

  @ApiProperty({ description: 'Comment content' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'Comment status', enum: ContentStatusEnum })
  @Expose()
  status: ContentStatusEnum;

  @ApiProperty({ description: 'Comment creation date' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Comment update date' })
  @Expose()
  updatedAt: Date;
}

export class CommentItemApiResponse extends ApiResponse(CommentItem) {}

export class CommentList extends AppPaginatedDataResponse(CommentItem) {}

export class CommentListApiResponse extends ApiResponse(CommentList) {}
