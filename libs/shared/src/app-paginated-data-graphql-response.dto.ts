import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AppCodes } from './enums/app-codes.enum';
import { IPaginatedData, IPaginatedMetadata } from './interfaces/paginated-data.interface';

@ObjectType()
export class PaginationMeta implements IPaginatedMetadata {
  @Field(() => Int) total: number;
  @Field(() => Int) page: number;
  @Field(() => Int) lastPage: number;
  @Field(() => Int) take: number;
}

export function AppPaginatedDataGraphqlResponse<T>(
  ItemClass: Type<T>,
): Type<{ data?: IPaginatedData<T>; code: AppCodes }> {
  @ObjectType(`${ItemClass.name}Data`, { isAbstract: true })
  abstract class ItemsData {
    @Field(() => [ItemClass])
    items: T[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
  }

  @ObjectType()
  abstract class ResponseType {
    @Field(() => ItemsData, { nullable: true })
    data?: ItemsData;

    @Field(() => AppCodes)
    code: AppCodes;
  }

  return ResponseType as Type<{ data?: IPaginatedData<T>; code: AppCodes }>;
}
