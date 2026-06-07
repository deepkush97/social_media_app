import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { IPostRecommendationItem } from '@app/shared/interfaces/social/post-recommendation.interface';

@ObjectType()
export class FeedItemDto implements IPostRecommendationItem {
  @Field(() => Int)
  postId: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class FeedOutputDto extends AppPaginatedDataGraphqlResponse(FeedItemDto) {}
