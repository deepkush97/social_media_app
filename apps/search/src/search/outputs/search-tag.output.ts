import { Field, Float, ObjectType } from '@nestjs/graphql';

import { AppPaginatedDataGraphqlResponse } from '@app/shared/app-paginated-data-graphql-response.dto';
import { ISearchTagHit } from '@app/shared/interfaces/search/search-tag-hit.interface';

@ObjectType()
export class SearchTagHitDto implements ISearchTagHit {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  score: number;
}

@ObjectType()
export class SearchTagOutputDto extends AppPaginatedDataGraphqlResponse(SearchTagHitDto) {}
