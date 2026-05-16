import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

export class FindPostsRequest {
  @ApiProperty({ description: 'page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'take' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 10;

  @ApiProperty({ description: 'status', enum: PostStatusEnum })
  @IsOptional()
  @IsEnum(PostStatusEnum)
  status?: PostStatusEnum = PostStatusEnum.ACTIVE;
}
