import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength } from 'class-validator';

import { INewComment } from '@app/shared/interfaces/comment/comment.interface';

export class CreateCommentRequest implements INewComment {
  @IsNotEmpty()
  @ApiProperty({ description: 'Comment content' })
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Parent comment id', required: false })
  parentId: number | null = null;
}
