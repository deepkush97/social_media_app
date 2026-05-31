import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { SearchService } from './search.service';

@Injectable()
export class SearchSubscriberService {
  constructor(
    private readonly searchService: SearchService,
    private readonly logger: AppLoggerService,
  ) {}

  @EventHandler(NatsEvents.POST_CREATED)
  async handlePostCreated(data: {
    id: number;
    title: string;
    content?: string;
    userId: number;
    createdAt?: string;
  }): Promise<void> {
    try {
      await this.searchService.indexPost(data);
      this.logger.info(`Indexed post ${data.id}`, {
        context: SearchSubscriberService.name,
      });
    } catch (error) {
      this.logger.error(`Failed to index post ${data.id}`, {
        context: SearchSubscriberService.name,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  @EventHandler(NatsEvents.USER_CREATED)
  async handleUserCreated(data: { id: number; email: string; name: string }): Promise<void> {
    try {
      await this.searchService.indexUser({
        id: data.id,
        username: data.email,
        displayName: data.name,
      });
      this.logger.info(`Indexed user ${data.id}`, {
        context: SearchSubscriberService.name,
      });
    } catch (error) {
      this.logger.error(`Failed to index user ${data.id}`, {
        context: SearchSubscriberService.name,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  @EventHandler(NatsEvents.TAG_CREATED)
  async handleTagCreated(data: { tags: { id: number; name: string }[] }): Promise<void> {
    for (const tag of data.tags) {
      try {
        await this.searchService.indexTag(tag);
        this.logger.info(`Indexed tag ${tag.id}`, {
          context: SearchSubscriberService.name,
        });
      } catch (error) {
        this.logger.error(`Failed to index tag ${tag.id}`, {
          context: SearchSubscriberService.name,
          error: error instanceof Error ? error.message : error,
        });
      }
    }
  }
}
