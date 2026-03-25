import { Exclude, Expose } from 'class-transformer';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

import { AppPaginatedDataResponse } from '../../responses/pagination.response';

@Exclude()
export class PostResponse implements Omit<IPost, 'userId'> {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  image?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  status: PostStatusEnum;
}

export class PostListResponse extends AppPaginatedDataResponse(PostResponse) {}
