import { describe, expect, it } from 'vitest';

import { createPaginatedResponse } from './create-paginated-response';

describe('createPaginatedResponse', () => {
  const items = [{ id: 1 }, { id: 2 }];

  it('returns items and meta with total and pagination', () => {
    const result = createPaginatedResponse(items, 20, 1, 10);

    expect(result.items).toBe(items);
    expect(result.meta).toEqual({ total: 20, page: 1, lastPage: 2, take: 10 });
  });

  it('calculates lastPage correctly when total is evenly divisible', () => {
    const result = createPaginatedResponse(items, 20, 2, 10);

    expect(result.meta.lastPage).toBe(2);
  });

  it('rounds up lastPage when total has a remainder', () => {
    const result = createPaginatedResponse(items, 21, 1, 10);

    expect(result.meta.lastPage).toBe(3);
  });

  it('handles single item and single page', () => {
    const result = createPaginatedResponse(items, 1, 1, 10);

    expect(result.meta.lastPage).toBe(1);
    expect(result.meta.page).toBe(1);
    expect(result.meta.take).toBe(10);
  });

  it('handles zero total', () => {
    const result = createPaginatedResponse([], 0, 1, 10);

    expect(result.meta.lastPage).toBe(0);
    expect(result.meta.total).toBe(0);
  });

  it('preserves item type through generic', () => {
    const stringItems = ['a', 'b', 'c'];
    const result = createPaginatedResponse(stringItems, 3, 1, 10);

    expect(result.items).toEqual(['a', 'b', 'c']);
  });
});
