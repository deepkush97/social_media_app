import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { PostStatusEnum } from '@app/shared/enums/post-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

@ObjectType()
export class PostOutput implements IPost {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => PostStatusEnum)
  status: PostStatusEnum;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PostOutputDto extends AppGraphqlResponse(PostOutput) {}

@ObjectType()
export class PostListOutputDto extends AppPaginatedDataGraphqlResponse(PostOutput) {}
