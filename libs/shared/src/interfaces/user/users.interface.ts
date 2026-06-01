import { IBaseEntity } from '../base-entity.interface';

export interface ILoginUser {
  email: string;
  password: string;
}

export interface INewUser extends ILoginUser {
  name: string;
}

export interface IUser extends INewUser, IBaseEntity {}

export type ICurrentUser = Omit<IUser, 'updatedAt' | 'password'> & { sessionId: string };
