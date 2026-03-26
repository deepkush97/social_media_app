import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

export class FindPostsRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 10;

  @IsOptional()
  @IsEnum(PostStatusEnum)
  status?: PostStatusEnum = PostStatusEnum.ACTIVE;
}
