import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { INewUser } from '@app/shared/interfaces/user/users.interface';

@InputType()
export class CreateUserInput implements INewUser {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

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
