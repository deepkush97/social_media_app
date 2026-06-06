import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';

import { IBaseWithUserIdEntity } from '../base-entity.interface';

export interface INewPost {
  title: string;
  content: string;
  image?: string;
}

export interface IPost extends INewPost, IBaseWithUserIdEntity {
  status: ContentStatusEnum;
  tags: string[];
}

export interface INewPostWithUserId extends INewPost {
  userId: number;
}
