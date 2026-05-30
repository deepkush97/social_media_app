import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';

@ObjectType()
export class InteractionDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class InteractionOutputDto extends AppGraphqlResponse(InteractionDto) {}
