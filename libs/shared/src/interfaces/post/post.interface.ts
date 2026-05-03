import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

import { IBaseEntity } from '../base-entity.interface';

export interface INewPost {
  title: string;
  content: string;
  image?: string;
}

export interface IPost extends INewPost, IBaseEntity {
  status: PostStatusEnum;
}

export interface INewPostWithUserId extends INewPost {
  userId: number;
}
