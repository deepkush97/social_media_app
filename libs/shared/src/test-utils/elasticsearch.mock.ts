import { vi } from 'vitest';

export type MockElasticsearchService = {
  index: ReturnType<typeof vi.fn>;
  bulk: ReturnType<typeof vi.fn>;
  search: ReturnType<typeof vi.fn>;
  indices: {
    exists: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
};

export function createMockEs(): MockElasticsearchService {
  return {
    index: vi.fn(),
    bulk: vi.fn(),
    search: vi.fn(),
    indices: {
      exists: vi.fn().mockResolvedValue(false),
      create: vi.fn(),
    },
  };
}
