export interface ILoginUser {
  email: string;
  password: string;
}

export interface INewUser extends ILoginUser {
  name: string;
}

export interface IUser extends INewUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ICurrentUser = Omit<IUser, 'updatedAt' | 'password'> & { sessionId: string };
