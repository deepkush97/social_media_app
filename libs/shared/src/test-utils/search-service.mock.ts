import { vi } from 'vitest';

export interface MockSearchService {
  indexPost: ReturnType<typeof vi.fn>;
  indexUser: ReturnType<typeof vi.fn>;
  indexTag: ReturnType<typeof vi.fn>;
  bulkIndexTags: ReturnType<typeof vi.fn>;
  searchPosts: ReturnType<typeof vi.fn>;
  searchUsers: ReturnType<typeof vi.fn>;
  searchTags: ReturnType<typeof vi.fn>;
}

export function createMockSearchService(): MockSearchService {
  return {
    indexPost: vi.fn(),
    indexUser: vi.fn(),
    indexTag: vi.fn(),
    bulkIndexTags: vi.fn(),
    searchPosts: vi.fn(),
    searchUsers: vi.fn(),
    searchTags: vi.fn(),
  };
}
