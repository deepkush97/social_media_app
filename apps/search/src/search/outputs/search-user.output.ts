import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { ISearchUserHitOutput } from '@app/shared/interfaces/search/search-user-hit-output.interface';

@ObjectType()
export class SearchUserHitDto implements ISearchUserHitOutput {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class SearchUserOutputDto extends AppPaginatedDataGraphqlResponse(SearchUserHitDto) {}
