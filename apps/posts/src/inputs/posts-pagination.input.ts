import { Field, InputType, Int } from '@nestjs/graphql';

import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
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

  @Field(() => PostStatusEnum, { defaultValue: PostStatusEnum.ACTIVE })
  @IsEnum(PostStatusEnum)
  @IsOptional()
  status?: PostStatusEnum;
}
