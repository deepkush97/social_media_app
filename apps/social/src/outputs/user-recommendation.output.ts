import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { IUserRecommendationItem } from '@app/shared/interfaces/social/user-recommendation.interface';

@ObjectType()
export class UserRecommendationItemDto implements IUserRecommendationItem {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  commonFollowers: number;

  @Field(() => Int)
  likedPostsScore: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class UserRecommendationOutputDto extends AppPaginatedDataGraphqlResponse(
  UserRecommendationItemDto,
) {}
