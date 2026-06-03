import { IPaginatedData } from '../interfaces/paginated-data.interface';

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  take: number,
): IPaginatedData<T> {
  if (total === 0) {
    return { items, meta: { total: 0, page, lastPage: 0, take } };
  }

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
