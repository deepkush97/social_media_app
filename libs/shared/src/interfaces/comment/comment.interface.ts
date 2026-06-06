import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';

import { IBaseWithUserIdEntity } from '../base-entity.interface';

export interface INewComment {
  content: string;
  parentId?: number;
}

export interface INewPostComment extends INewComment {
  postId: number;
}

export interface IComment extends INewPostComment, IBaseWithUserIdEntity {
  status: ContentStatusEnum;
}

export interface INewCommentWithUserId extends INewPostComment {
  userId: number;
}
