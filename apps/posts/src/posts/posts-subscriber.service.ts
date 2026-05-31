import { Injectable } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { TagCreatedEvent } from '@app/shared/events/tag-created.event';
import { EventBusClient } from '@app/shared/nats/event-bus-client.service';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { PostsService } from './posts.service';

@Injectable()
export class PostsSubscriberService {
  constructor(
    private readonly postsService: PostsService,
    private readonly eventBusClient: EventBusClient,
    private readonly logger: AppLoggerService,
  ) {}

  @EventHandler(NatsEvents.POST_CREATED)
  async handlePostCreated(data: {
    id: number;
    title: string;
    content: string;
    userId: number;
    tags?: string[];
  }): Promise<void> {
    try {
      const tagNames = data.tags ?? [];
      if (tagNames.length === 0) return;

      const createdTags = await this.postsService.findOrCreateTags(data.id, tagNames);

      if (createdTags.length > 0) {
        await this.eventBusClient
          .emit(new TagCreatedEvent({ tags: createdTags }), this.constructor.name)
          .catch((e) => {
            this.logger.error('Failed to emit TAG_CREATED', {
              context: PostsSubscriberService.name,
              error: e instanceof Error ? e.message : e,
            });
          });
      }
    } catch (error) {
      this.logger.error(`Failed to process tags for post ${data.id}`, {
        context: PostsSubscriberService.name,
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
