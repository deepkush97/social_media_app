import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import {
  SearchIndexRetryEvent,
  SearchRetryType,
} from '@app/shared/events/search-index-retry.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
import { EventBusEmitter } from '@app/shared/nats/event-bus-emitter.service';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { SearchService } from './search.service';

const MAX_RETRY_COUNT = 10;

@Injectable()
export class SearchSubscriberService {
  constructor(
    private readonly searchService: SearchService,
    private readonly eventBusEmitter: EventBusEmitter,
    private readonly logger: AppLoggerService,
  ) {}

  @EventHandler(NatsEvents.POST_CREATED)
  async handlePostCreated(data: PostCreatedEventPayload): Promise<void> {
    try {
      await this.searchService.indexPost(data);
    } catch (error) {
      this.logger.warn(`ES index failed for post ${data.id}, queuing retry`, {
        context: SearchSubscriberService.name,
        error: error instanceof Error ? error.message : error,
      });
      await this.emitRetry(SearchRetryType.INDEX_POST, data, 0);
      return;
    }

    if (data.tags.length > 0) {
      try {
        await this.searchService.bulkIndexTags(data.tags);
      } catch (error) {
        this.logger.warn(`ES bulk index tags failed for post ${data.id}, queuing retry`, {
          context: SearchSubscriberService.name,
          error: error instanceof Error ? error.message : error,
        });
        await this.emitRetry(SearchRetryType.INDEX_BULK_TAGS, { tags: data.tags }, 0);
        return;
      }
    }

    this.logger.info(`Indexed post ${data.id}`, {
      context: SearchSubscriberService.name,
    });
  }

  @EventHandler(NatsEvents.USER_CREATED)
  async handleUserCreated(data: UserCreateEventPayload): Promise<void> {
    try {
      await this.searchService.indexUser(data);
      this.logger.info(`Indexed user ${data.id}`, {
        context: SearchSubscriberService.name,
      });
    } catch (error) {
      this.logger.warn(`ES index failed for user ${data.id}, queuing retry`, {
        context: SearchSubscriberService.name,
        error: error instanceof Error ? error.message : error,
      });
      await this.emitRetry(SearchRetryType.INDEX_USER, data, 0);
    }
  }

  @EventHandler(NatsEvents.SEARCH_INDEX_RETRY)
  async handleRetry(event: {
    retryType: SearchRetryType;
    payload: Record<string, unknown>;
    retryCount: number;
  }): Promise<void> {
    const { retryType, payload, retryCount } = event;

    try {
      switch (retryType) {
        case SearchRetryType.INDEX_POST:
          await this.searchService.indexPost(
            payload as PostCreatedEventPayload & { tags: string[] },
          );
          break;
        case SearchRetryType.INDEX_USER:
          await this.searchService.indexUser(payload as UserCreateEventPayload);
          break;
        case SearchRetryType.INDEX_BULK_TAGS:
          await this.searchService.bulkIndexTags((payload as { tags: string[] }).tags);
          break;
      }

      this.logger.info(`Retry succeeded for ${retryType} after ${retryCount} attempt(s)`, {
        context: SearchSubscriberService.name,
      });
    } catch (error) {
      if (retryCount < MAX_RETRY_COUNT) {
        const delayMs = Math.min(1000 * Math.pow(2, retryCount), 60_000);
        this.logger.warn(
          `Retry ${retryCount + 1}/${MAX_RETRY_COUNT} failed for ${retryType}, next in ${delayMs}ms`,
          {
            context: SearchSubscriberService.name,
            error: error instanceof Error ? error.message : error,
          },
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await this.emitRetry(retryType, payload, retryCount + 1);
      } else {
        this.logger.error(`All ${MAX_RETRY_COUNT} retries exhausted for ${retryType}`, {
          context: SearchSubscriberService.name,
          error: error instanceof Error ? error.message : error,
          data: payload,
        });
      }
    }
  }

  private async emitRetry(
    retryType: SearchRetryType,
    payload: Record<string, unknown>,
    retryCount: number,
  ): Promise<void> {
    await this.eventBusEmitter.emit(
      new SearchIndexRetryEvent({ retryType, payload, retryCount }),
      this.constructor.name,
    );
  }
}
