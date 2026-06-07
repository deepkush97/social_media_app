import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';

import { AppGraphqlResponse } from '@app/shared/app-graphql-response.dto';
import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { ContentStatusEnum } from '@app/shared/enums/content-status.enum';
import { IPost } from '@app/shared/interfaces/post/post.interface';

@ObjectType()
@Directive('@key(fields: "id")')
export class PostOutput implements IPost {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => Int)
  userId: number;

  @Field(() => ContentStatusEnum)
  status: ContentStatusEnum;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PostOutputDto extends AppGraphqlResponse(PostOutput) {}

@ObjectType()
export class PostListOutputDto extends AppPaginatedDataGraphqlResponse(PostOutput) {}
