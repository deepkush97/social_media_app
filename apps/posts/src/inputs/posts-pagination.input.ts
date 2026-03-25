import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNumber, IsOptional, IsPositive } from 'class-validator';

import { IPaginationInput } from '@app/shared/interfaces/pagination-input.interface';

@InputType()
export class PostsPaginationInput implements IPaginationInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  take?: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  page?: number;
}
