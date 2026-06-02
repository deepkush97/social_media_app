import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { createMockLogger, MockLogger } from '@app/shared/test-utils/logger.mock';
import {
  createMockSearchService,
  MockSearchService,
} from '@app/shared/test-utils/search-service.mock';
import { extractTags } from '@app/shared/utils/extract-tags';

import { SearchService } from './search.service';
import { SearchSubscriberService } from './search-subscriber.service';

vi.mock('./utils/extract-tags', () => ({
  extractTags: vi.fn(),
}));

describe('SearchSubscriberService', () => {
  let service: SearchSubscriberService;
  let mockSearch: MockSearchService;
  let mockLogger: MockLogger;

  const postData: PostCreatedEventPayload = {
    id: 1,
    title: 'Test',
    content: 'Hello #world',
    userId: 42,
    createdAt: new Date(),
    tags: ['world'],
  };

  const userData = { id: 1, name: 'Alice', email: 'alice@test.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch = createMockSearchService();
    mockLogger = createMockLogger();
    service = new SearchSubscriberService(
      mockSearch as unknown as SearchService,
      mockLogger as unknown as AppLoggerService,
    );
  });

  describe('handlePostCreated', () => {
    it('extracts tags, indexes post, and bulk indexes tags', async () => {
      vi.mocked(extractTags).mockReturnValue(['world']);

      await service.handlePostCreated(postData);

      expect(extractTags).toHaveBeenCalledWith('Hello #world');
      expect(mockSearch.indexPost).toHaveBeenCalledWith({ ...postData, tags: ['world'] });
      expect(mockSearch.bulkIndexTags).toHaveBeenCalledWith(['world']);
      expect(mockLogger.info).toHaveBeenCalledWith('Indexed post 1', {
        context: SearchSubscriberService.name,
      });
    });

    it('does not call bulkIndexTags when no tags extracted', async () => {
      vi.mocked(extractTags).mockReturnValue([]);

      await service.handlePostCreated(postData);

      expect(mockSearch.indexPost).toHaveBeenCalledWith({ ...postData, tags: [] });
      expect(mockSearch.bulkIndexTags).not.toHaveBeenCalled();
    });

    it('logs error when extraction or indexing fails', async () => {
      const error = new Error('ES down');
      vi.mocked(extractTags).mockImplementation(() => {
        throw error;
      });

      await service.handlePostCreated(postData);

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to index post 1', {
        context: SearchSubscriberService.name,
        error: 'ES down',
      });
    });
  });

  describe('handleUserCreated', () => {
    it('indexes the user and logs success', async () => {
      await service.handleUserCreated(userData);

      expect(mockSearch.indexUser).toHaveBeenCalledWith(userData);
      expect(mockLogger.info).toHaveBeenCalledWith('Indexed user 1', {
        context: SearchSubscriberService.name,
      });
    });

    it('logs error when indexing fails', async () => {
      const error = new Error('ES unavailable');
      mockSearch.indexUser.mockRejectedValue(error);

      await service.handleUserCreated(userData);

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to index user 1', {
        context: SearchSubscriberService.name,
        error: 'ES unavailable',
      });
    });
  });
});
