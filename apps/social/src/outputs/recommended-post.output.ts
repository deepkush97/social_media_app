import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';

@ObjectType()
export class RecommendedPostDto {
  @Field(() => Int)
  postId: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class RecommendedPostOutputDto extends AppPaginatedDataGraphqlResponse(RecommendedPostDto) {}
