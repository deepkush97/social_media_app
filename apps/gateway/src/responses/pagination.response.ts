import { Type } from '@nestjs/common';

import { Exclude, Expose, Type as TransformerType } from 'class-transformer';

import {
  IPaginatedData,
  IPaginatedMetadata,
} from '@app/shared/interfaces/paginated-data.interface';

@Exclude()
export class PaginationMeta implements IPaginatedMetadata {
  @Expose() total: number;
  @Expose() page: number;
  @Expose() lastPage: number;
  @Expose() take: number;
}

export function AppPaginatedDataResponse<T>(ItemClass: Type<T>): Type<IPaginatedData<T>> {
  @Exclude()
  abstract class ResponseType {
    @Expose()
    @TransformerType(() => ItemClass)
    items: T[];

    @Expose()
    meta: PaginationMeta;
  }

  return ResponseType as Type<IPaginatedData<T>>;
}
