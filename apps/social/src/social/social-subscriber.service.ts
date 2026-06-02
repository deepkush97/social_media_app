import { Injectable } from '@nestjs/common';

import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { PostLikedEventPayload } from '@app/shared/events/post-liked.event';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { SocialService } from './social.service';

@Injectable()
export class SocialSubscriberService {
  constructor(private readonly socialService: SocialService) {}

  @EventHandler(NatsEvents.POST_LIKED)
  async onPostLiked({ userId, postOwnerId, tags }: PostLikedEventPayload): Promise<void> {
    if (userId === postOwnerId) return;

    await this.socialService.boostFollowWeight(userId, postOwnerId, 0.5);
    await this.socialService.boostTagWeight(userId, tags, 1.0);
  }

  @EventHandler(NatsEvents.POST_CREATED)
  async onPostCreated({ userId, id, tags }: PostCreatedEventPayload): Promise<void> {
    await this.socialService.boostTagWeight(userId, tags, 1.0);
    await this.socialService.trackPostCreation(userId, id, tags);
  }
}
