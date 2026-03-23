import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { AuthSessionEnum } from '@app/shared/enums/auth-session.enum';

@ObjectType()
export class SessionOutput {
  @Field(() => Int)
  id: number;

  @Field()
  guid: string;

  @Field(() => Int)
  userId: number;

  @Field(() => AuthSessionEnum)
  status: AuthSessionEnum;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SessionOutputDto extends AppGraphqlResponse(SessionOutput) {}
