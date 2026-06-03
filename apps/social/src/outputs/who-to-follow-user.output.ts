import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { IWhoToFollowUser } from '@app/shared/interfaces/social/who-to-follow-user.interface';

@ObjectType()
export class WhoToFollowUserDto implements IWhoToFollowUser {
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
export class WhoToFollowOutputDto extends AppPaginatedDataGraphqlResponse(WhoToFollowUserDto) {}
