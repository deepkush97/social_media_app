import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { createMockLogger, MockLogger } from '@app/shared/test-utils/logger.mock';
import {
  createMockSearchService,
  MockSearchService,
} from '@app/shared/test-utils/search-service.mock';

import { SearchService } from './search.service';
import { SearchSubscriberService } from './search-subscriber.service';

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
    it('indexes post and bulk indexes tags', async () => {
      await service.handlePostCreated(postData);

      expect(mockSearch.indexPost).toHaveBeenCalledWith(postData);
      expect(mockSearch.bulkIndexTags).toHaveBeenCalledWith(['world']);
      expect(mockLogger.info).toHaveBeenCalledWith('Indexed post 1', {
        context: SearchSubscriberService.name,
      });
    });

    it('does not call bulkIndexTags when tags array is empty', async () => {
      await service.handlePostCreated({ ...postData, tags: [] });

      expect(mockSearch.indexPost).toHaveBeenCalledWith({ ...postData, tags: [] });
      expect(mockSearch.bulkIndexTags).not.toHaveBeenCalled();
    });

    it('logs error when indexing fails', async () => {
      const error = new Error('ES down');
      mockSearch.indexPost.mockRejectedValue(error);

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
