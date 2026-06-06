import { Field, InputType, Int } from '@nestjs/graphql';

import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { PaginationInput } from '@app/shared/inputs/pagination.input';

@InputType()
export class CommentsPaginationInput extends PaginationInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  postId: number;

  @Field(() => ContentStatusEnum, { defaultValue: ContentStatusEnum.ACTIVE })
  @IsEnum(ContentStatusEnum)
  @IsOptional()
  status?: ContentStatusEnum = ContentStatusEnum.ACTIVE;
}
