import { ICurrentUser } from '../user/users.interface';

export interface IAuthProfile {
  profile: ICurrentUser;
}

export interface IAuthProfileToken extends IAuthProfile {
  jwtToken: string;
}
