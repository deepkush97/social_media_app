import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { extractTags } from './utils/extract-tags';

import { SearchService } from './search.service';

@Injectable()
export class SearchSubscriberService {
  constructor(
    private readonly searchService: SearchService,
    private readonly logger: AppLoggerService,
  ) {}

  @EventHandler(NatsEvents.POST_CREATED)
  async handlePostCreated(data: PostCreatedEventPayload): Promise<void> {
    try {
      const tags = extractTags(data.content);
      await this.searchService.indexPost({ ...data, tags });

      if (tags.length > 0) {
        await this.searchService.bulkIndexTags(tags);
      }

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
  async handleUserCreated(data: UserCreateEventPayload): Promise<void> {
    try {
      await this.searchService.indexUser(data);
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
}
