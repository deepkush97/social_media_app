import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { INewUser } from '@app/shared/interfaces/user/users.interface';

export class SignupRequest implements INewUser {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
