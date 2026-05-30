import { IBaseEntity } from '../base-entity.interface';

export interface INewLike {
  postId: number;
}

export interface ILike extends INewLike, IBaseEntity {}

export interface INewLikeWithUserId extends INewLike {
  userId: number;
}
