import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';

export class SearchRequest {
  @IsString()
  @ApiProperty({ description: 'Search query' })
  q: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ description: 'Items per page', default: 20, required: false })
  take?: number;
}
