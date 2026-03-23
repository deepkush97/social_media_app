import { Exclude, Expose } from 'class-transformer';

import { IAuthProfile, IAuthProfileToken } from '@app/shared/interfaces/auth/auth-user.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

@Exclude()
export class AuthUserResponse implements ICurrentUser {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  sessionId: string;

  @Expose()
  createdAt: Date;
}

@Exclude()
export class AuthProfile implements IAuthProfile {
  @Expose()
  profile: AuthUserResponse;
}

@Exclude()
export class AuthProfileToken extends AuthProfile implements IAuthProfileToken {
  @Expose()
  jwtToken: string;
}
