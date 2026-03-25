import { IPaginatedData } from '../interfaces/paginated-data.interface';

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  take: number,
): IPaginatedData<T> {
  const lastPage = Math.ceil(total / take);

  return {
    items,
    meta: {
      total,
      page,
      lastPage,
      take,
    },
  };
}
