import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { ILike } from '@app/shared/interfaces/like/like.interface';

@ObjectType()
export class LikeDto implements ILike {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class LikeOutputDto extends AppGraphqlResponse(LikeDto) {}
