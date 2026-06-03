import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNumber, IsPositive } from 'class-validator';

import { PaginationInput } from '@app/shared/inputs/pagination.input';

@InputType()
export class RecommendedPostsInput extends PaginationInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;
}
