import { vi } from 'vitest';

export interface MockRepository {
  create: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  findOne: ReturnType<typeof vi.fn>;
  findAndCount: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

export function createMockRepo(): MockRepository {
  return {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    findAndCount: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}
