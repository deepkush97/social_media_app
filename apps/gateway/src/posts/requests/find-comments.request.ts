import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';

import { PaginationRequest } from '../../requests/pagination.request';

export class FindCommentsRequest extends PaginationRequest {
  @ApiProperty({ description: 'status', enum: ContentStatusEnum, required: false })
  @IsOptional()
  @IsEnum(ContentStatusEnum)
  status?: ContentStatusEnum = ContentStatusEnum.ACTIVE;
}
