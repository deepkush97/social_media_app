import { Injectable } from '@nestjs/common';

import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { PostLikedEventPayload } from '@app/shared/events/post-liked.event';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';
import { extractTags } from '@app/shared/utils/extract-tags';

import { SocialService } from './social.service';

@Injectable()
export class SocialSubscriberService {
  constructor(private readonly socialService: SocialService) {}

  @EventHandler(NatsEvents.POST_LIKED)
  async onPostLiked({ userId, postOwnerId, content }: PostLikedEventPayload): Promise<void> {
    if (userId === postOwnerId) return;

    await this.socialService.boostFollowWeight(userId, postOwnerId, 0.5);

    const tags = extractTags(content);
    await this.socialService.boostTagWeight(userId, tags, 1.0);
  }
}
