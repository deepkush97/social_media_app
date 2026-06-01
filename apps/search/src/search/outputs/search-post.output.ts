import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { ISearchPostHit } from '@app/shared/interfaces/search/search-post-hit.interface';

@ObjectType()
export class SearchPostHitDto implements ISearchPostHit {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  score: number;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@ObjectType()
export class SearchPostOutputDto extends AppPaginatedDataGraphqlResponse(SearchPostHitDto) {}
