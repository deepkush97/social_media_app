import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { PostStatusEnum } from '@app/shared/enums/post-status.enum';

import { PaginationRequest } from '../../requests/pagination.request';

export class FindPostsRequest extends PaginationRequest {
  @ApiProperty({ description: 'status', enum: PostStatusEnum, required: false })
  @IsOptional()
  @IsEnum(PostStatusEnum)
  status?: PostStatusEnum = PostStatusEnum.ACTIVE;
}
