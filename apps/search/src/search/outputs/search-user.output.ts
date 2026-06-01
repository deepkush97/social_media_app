import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';

@ObjectType()
export class SearchUserHitDto {
  @Field(() => Int)
  userId: number;

  @Field()
  username: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class SearchUserOutputDto extends AppPaginatedDataGraphqlResponse(SearchUserHitDto) {}
