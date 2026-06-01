import { ElasticsearchService } from '@nestjs/elasticsearch';

import { beforeEach, describe, expect, it } from 'vitest';

import { createMockEs, MockElasticsearchService } from '@app/shared/test-utils/elasticsearch.mock';
import { createMockLogger, MockLogger } from '@app/shared/test-utils/logger.mock';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let mockEs: MockElasticsearchService;
  let mockLogger: MockLogger;

  beforeEach(() => {
    mockEs = createMockEs();
    mockLogger = createMockLogger();
    service = new SearchService(mockEs as unknown as ElasticsearchService, mockLogger as never);
  });

  describe('onModuleInit', () => {
    it('creates posts, users, and tags indices if they do not exist', async () => {
      await service.onModuleInit();

      expect(mockEs.indices.create).toHaveBeenCalledTimes(3);
      expect(mockEs.indices.create).toHaveBeenCalledWith(
        expect.objectContaining({ index: 'posts' }),
      );
      expect(mockEs.indices.create).toHaveBeenCalledWith(
        expect.objectContaining({ index: 'users' }),
      );
      expect(mockEs.indices.create).toHaveBeenCalledWith(
        expect.objectContaining({ index: 'tags' }),
      );
    });

    it('skips index creation if they already exist', async () => {
      mockEs.indices.exists.mockResolvedValue(true);

      await service.onModuleInit();

      expect(mockEs.indices.create).not.toHaveBeenCalled();
    });
  });

  describe('indexPost', () => {
    it('indexes a post document with tags', async () => {
      const post = {
        id: 1,
        title: 'My Post',
        content: 'Post content',
        tags: ['react', 'graphql'],
        userId: 42,
        createdAt: new Date('2025-01-01T00:00:00Z'),
      };

      await service.indexPost(post);

      expect(mockEs.index).toHaveBeenCalledWith({
        index: 'posts',
        id: '1',
        document: post,
      });
    });

    it('preserves the createdAt date in the document', async () => {
      const createdAt = new Date('2025-06-01T12:00:00Z');
      const post = {
        id: 2,
        title: 'With Date',
        content: 'Content',
        tags: [],
        userId: 1,
        createdAt,
      };

      await service.indexPost(post);

      const call = mockEs.index.mock.calls[0][0];
      expect(call.document.createdAt).toBe(createdAt);
    });
  });

  describe('indexUser', () => {
    it('indexes a user document from the event payload', async () => {
      const user = { id: 1, name: 'Alice', email: 'alice@example.com' };

      await service.indexUser(user);

      expect(mockEs.index).toHaveBeenCalledWith({
        index: 'users',
        id: '1',
        document: user,
      });
    });
  });

  describe('indexTag', () => {
    it('indexes a tag document using the name as _id', async () => {
      await service.indexTag('react');

      expect(mockEs.index).toHaveBeenCalledWith({
        index: 'tags',
        id: 'react',
        document: { name: 'react' },
      });
    });
  });

  describe('bulkIndexTags', () => {
    it('sends bulk operations for multiple tags', async () => {
      await service.bulkIndexTags(['react', 'graphql']);

      expect(mockEs.bulk).toHaveBeenCalledWith({
        operations: [
          { index: { _index: 'tags', _id: 'react' } },
          { name: 'react' },
          { index: { _index: 'tags', _id: 'graphql' } },
          { name: 'graphql' },
        ],
      });
    });

    it('does nothing for an empty array', async () => {
      await service.bulkIndexTags([]);

      expect(mockEs.bulk).not.toHaveBeenCalled();
    });
  });

  describe('searchPosts', () => {
    const hits = [
      {
        _id: '1',
        _score: 1.5,
        _source: {
          id: 1,
          title: 'Test Post',
          content: 'Some content',
          tags: ['react'],
          userId: 42,
        },
      },
    ];

    it('returns paginated results from ES hits', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits, total: { value: 1 } },
      });

      const result = await service.searchPosts('test', 1, 10);

      expect(mockEs.search).toHaveBeenCalledWith({
        index: 'posts',
        from: 0,
        size: 10,
        query: {
          multi_match: {
            query: 'test',
            fields: ['title^3', 'content'],
            fuzziness: 'AUTO',
          },
        },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: 1,
        title: 'Test Post',
        content: 'Some content',
        tags: ['react'],
        userId: 42,
        score: 1.5,
      });
      expect(result.meta).toEqual({ total: 1, page: 1, lastPage: 1, take: 10 });
    });

    it('handles total as a plain number', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits, total: 1 },
      });

      const result = await service.searchPosts('test', 1, 10);

      expect(result.meta.total).toBe(1);
    });

    it('returns empty items when there are no hits', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits: [], total: { value: 0 } },
      });

      const result = await service.searchPosts('test', 1, 10);

      expect(result.items).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('calculates from offset correctly for page 2', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits: [], total: { value: 0 } },
      });

      await service.searchPosts('test', 2, 10);

      expect(mockEs.search).toHaveBeenCalledWith(expect.objectContaining({ from: 10, size: 10 }));
    });
  });

  describe('searchUsers', () => {
    const hits = [
      {
        _id: '1',
        _score: 2.0,
        _source: { id: 1, email: 'alice@example.com', name: 'Alice' },
      },
    ];

    it('returns paginated results with email and name', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits, total: { value: 1 } },
      });

      const result = await service.searchUsers('alice', 1, 10);

      expect(mockEs.search).toHaveBeenCalledWith({
        index: 'users',
        from: 0,
        size: 10,
        query: {
          bool: {
            should: [
              { match: { email: { query: 'alice', boost: 3 } } },
              { match: { name: { query: 'alice', boost: 2 } } },
              { prefix: { email: { value: 'alice' } } },
            ],
          },
        },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: 1,
        email: 'alice@example.com',
        name: 'Alice',
        score: 2.0,
      });
      expect(result.meta).toEqual({ total: 1, page: 1, lastPage: 1, take: 10 });
    });

    it('returns empty items when there are no hits', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits: [], total: { value: 0 } },
      });

      const result = await service.searchUsers('alice', 1, 10);

      expect(result.items).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('searchTags', () => {
    const hits = [
      {
        _id: 'react',
        _score: 1.0,
        _source: { name: 'react' },
      },
    ];

    it('returns paginated results with _id as the id', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits, total: { value: 1 } },
      });

      const result = await service.searchTags('rea', 1, 10);

      expect(mockEs.search).toHaveBeenCalledWith({
        index: 'tags',
        from: 0,
        size: 10,
        query: { prefix: { name: 'rea' } },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: 'react',
        name: 'react',
        score: 1.0,
      });
      expect(result.meta).toEqual({ total: 1, page: 1, lastPage: 1, take: 10 });
    });

    it('returns empty items when there are no hits', async () => {
      mockEs.search.mockResolvedValue({
        hits: { hits: [], total: { value: 0 } },
      });

      const result = await service.searchTags('rea', 1, 10);

      expect(result.items).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });
});
