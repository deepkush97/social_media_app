import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ILoginUser } from '@app/shared/interfaces/user/users.interface';

export class LoginRequest implements ILoginUser {
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
