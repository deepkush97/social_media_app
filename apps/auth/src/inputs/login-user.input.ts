import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ILoginUser } from '@app/shared/interfaces/user/users.interface';

@InputType()
export class LoginUserInput implements ILoginUser {
  @Field()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
