import { Field, InputType, Int } from '@nestjs/graphql';

import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { PaginationInput } from '@app/shared/inputs/pagination.input';

@InputType()
export class PostsPaginationInput extends PaginationInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  userId: number;

  @Field(() => PostStatusEnum, { defaultValue: PostStatusEnum.ACTIVE })
  @IsEnum(PostStatusEnum)
  @IsOptional()
  status?: PostStatusEnum;
}
