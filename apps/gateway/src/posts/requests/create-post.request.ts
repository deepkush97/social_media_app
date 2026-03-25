import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { INewPost } from '@app/shared/interfaces/post/post.interface';

export class CreatePostRequest implements INewPost {
  @IsNotEmpty()
  @MaxLength(150)
  content: string;

  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @MaxLength(500)
  image?: string;
}
