import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
import { EventBusEmitter } from '@app/shared/nats/event-bus-emitter.service';
import { createMockLogger, MockLogger } from '@app/shared/test-utils/logger.mock';
import {
  createMockSearchService,
  MockSearchService,
} from '@app/shared/test-utils/search-service.mock';

import { SearchService } from './search.service';
import { SearchSubscriberService } from './search-subscriber.service';

function createMockEventBus(): { emit: ReturnType<typeof vi.fn> } {
  return { emit: vi.fn() };
}

describe('SearchSubscriberService', () => {
  let service: SearchSubscriberService;
  let mockSearch: MockSearchService;
  let mockLogger: MockLogger;
  let mockEventBus: { emit: ReturnType<typeof vi.fn> };

  const postData: PostCreatedEventPayload = {
    id: 1,
    title: 'Test',
    content: 'Hello #world',
    userId: 42,
    createdAt: new Date().toISOString(),
    tags: ['world'],
  };

  const userData: UserCreateEventPayload = { id: 1, name: 'Alice', email: 'alice@test.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch = createMockSearchService();
    mockLogger = createMockLogger();
    mockEventBus = createMockEventBus();
    service = new SearchSubscriberService(
      mockSearch as unknown as SearchService,
      mockEventBus as unknown as EventBusEmitter,
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
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('does not call bulkIndexTags when tags array is empty', async () => {
      await service.handlePostCreated({ ...postData, tags: [] });

      expect(mockSearch.indexPost).toHaveBeenCalledWith({ ...postData, tags: [] });
      expect(mockSearch.bulkIndexTags).not.toHaveBeenCalled();
    });

    it('queues retry when indexing fails', async () => {
      const error = new Error('ES down');
      mockSearch.indexPost.mockRejectedValue(error);

      await service.handlePostCreated(postData);

      expect(mockLogger.warn).toHaveBeenCalledWith('ES index failed for post 1, queuing retry', {
        context: SearchSubscriberService.name,
        error: 'ES down',
      });
      expect(mockEventBus.emit).toHaveBeenCalledOnce();
    });
  });

  describe('handleUserCreated', () => {
    it('indexes the user and logs success', async () => {
      await service.handleUserCreated(userData);

      expect(mockSearch.indexUser).toHaveBeenCalledWith(userData);
      expect(mockLogger.info).toHaveBeenCalledWith('Indexed user 1', {
        context: SearchSubscriberService.name,
      });
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('queues retry when indexing fails', async () => {
      const error = new Error('ES unavailable');
      mockSearch.indexUser.mockRejectedValue(error);

      await service.handleUserCreated(userData);

      expect(mockLogger.warn).toHaveBeenCalledWith('ES index failed for user 1, queuing retry', {
        context: SearchSubscriberService.name,
        error: 'ES unavailable',
      });
      expect(mockEventBus.emit).toHaveBeenCalledOnce();
    });
  });
});
