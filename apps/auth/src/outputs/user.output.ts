import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { IUser } from '@app/shared/interfaces/user/users.interface';

@ObjectType()
export class UserOutput implements Omit<IUser, 'password'> {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UserOutputDto extends AppGraphqlResponse(UserOutput) {}
