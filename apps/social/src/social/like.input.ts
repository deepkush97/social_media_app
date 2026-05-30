import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNumber, IsPositive } from 'class-validator';

import { INewLikeWithUserId } from '@app/shared/interfaces/like/like.interface';

@InputType()
export class LikeInput implements INewLikeWithUserId {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  postId: number;
}
