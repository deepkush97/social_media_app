import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength } from 'class-validator';

import { INewCommentWithUserId } from '@app/shared/interfaces/comment/comment.interface';

@InputType()
export class CreateCommentInput implements INewCommentWithUserId {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @Field(() => Int, { nullable: true, defaultValue: null })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentId: number | null = null;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;
}
