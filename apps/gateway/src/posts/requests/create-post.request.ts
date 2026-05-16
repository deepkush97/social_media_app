import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { INewPost } from '@app/shared/interfaces/post/post.interface';

export class CreatePostRequest implements INewPost {
  @IsNotEmpty()
  @ApiProperty({ description: 'Content' })
  @MaxLength(150)
  content: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Title' })
  @MaxLength(100)
  title: string;

  @IsOptional()
  @ApiProperty({ description: 'Image url', required: false })
  @MaxLength(500)
  image?: string;
}
