import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';

@ObjectType()
export class PostRecommendationItemDto implements IPostRecommendationItem {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class PostRecommendationOutputDto extends AppPaginatedDataGraphqlResponse(
  PostRecommendationItemDto,
) {}
