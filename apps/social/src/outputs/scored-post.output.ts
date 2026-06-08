import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { IScoredPostIdItem } from '@app/shared/interfaces/social/scored-post-id.interface';

@ObjectType('PostOutput')
@Directive('@key(fields: "id")')
export class ScoredPostItemDto implements IScoredPostIdItem {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class ScoredPostOutputDto extends AppPaginatedDataGraphqlResponse(ScoredPostItemDto) {}
