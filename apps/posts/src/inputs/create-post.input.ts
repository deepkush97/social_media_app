import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength } from 'class-validator';

import { INewUserWithUserId } from '@app/shared/interfaces/post/post.interface';

@InputType()
export class CreatePostInput implements INewUserWithUserId {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(140)
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  image?: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;
}
