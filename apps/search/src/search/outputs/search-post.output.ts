import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';

@ObjectType()
export class SearchPostHitDto {
  @Field(() => Int)
  postId: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class SearchPostOutputDto extends AppPaginatedDataGraphqlResponse(SearchPostHitDto) {}
