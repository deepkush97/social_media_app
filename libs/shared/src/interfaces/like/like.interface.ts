import { IBaseWithUserIdEntity } from '../base-entity.interface';

export interface INewLike {
  postId: number;
}

export interface ILike extends INewLike, IBaseWithUserIdEntity {}

export interface INewLikeWithUserId extends INewLike {
  userId: number;
}
