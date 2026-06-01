import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

import { IBaseWithUserIdEntity } from '../base-entity.interface';

export interface INewPost {
  title: string;
  content: string;
  image?: string;
}

export interface IPost extends INewPost, IBaseWithUserIdEntity {
  status: PostStatusEnum;
}

export interface INewPostWithUserId extends INewPost {
  userId: number;
}
