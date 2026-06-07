import { Injectable } from '@nestjs/common';

import { NatsEvents } from '@app/shared/enums/nats-events.enum';
import { CommentCreatedEventPayload } from '@app/shared/events/comment-created.event';
import { PostCreatedEventPayload } from '@app/shared/events/post-created.event';
import { PostLikedEventPayload } from '@app/shared/events/post-liked.event';
import { UserCreateEventPayload } from '@app/shared/events/user-created.event';
import { UserFollowedEventPayload } from '@app/shared/events/user-followed.event';
import { EventHandler } from '@app/shared/nats/event-handler.decorator';

import { SocialService } from './social.service';
import {
  WEIGHT_INTEREST_COMMENT,
  WEIGHT_INTEREST_FOLLOW,
  WEIGHT_INTEREST_LIKE,
  WEIGHT_INTEREST_POST_CREATE,
} from './social-weight.constants';

@Injectable()
export class SocialSubscriberService {
  constructor(private readonly socialService: SocialService) {}

  @EventHandler(NatsEvents.COMMENT_CREATED)
  async onCommentCreated({ userId, postOwnerId, tags }: CommentCreatedEventPayload): Promise<void> {
    if (userId === postOwnerId) return;

    await this.socialService.boostTagWeight(userId, tags, WEIGHT_INTEREST_COMMENT);
  }

  @EventHandler(NatsEvents.POST_LIKED)
  async onPostLiked({ userId, postOwnerId, tags }: PostLikedEventPayload): Promise<void> {
    if (userId === postOwnerId) return;

    await this.socialService.boostFollowWeight(userId, postOwnerId, WEIGHT_INTEREST_FOLLOW);
    await this.socialService.boostTagWeight(userId, tags, WEIGHT_INTEREST_LIKE);
  }

  @EventHandler(NatsEvents.POST_UNLIKED)
  async onPostUnliked({ userId, postOwnerId }: PostLikedEventPayload): Promise<void> {
    if (userId === postOwnerId) return;

    await this.socialService.removeLikeEdge(userId, postOwnerId);
  }

  @EventHandler(NatsEvents.USER_CREATED)
  async onUserCreated({ id }: UserCreateEventPayload): Promise<void> {
    await this.socialService.ensureUserNode(id);
  }

  @EventHandler(NatsEvents.USER_FOLLOWED)
  async onUserFollowed({ followerId, followingId }: UserFollowedEventPayload): Promise<void> {
    await this.socialService.createFollowEdge(followerId, followingId);
  }

  @EventHandler(NatsEvents.USER_UNFOLLOWED)
  async onUserUnfollowed({ followerId, followingId }: UserFollowedEventPayload): Promise<void> {
    await this.socialService.removeFollowEdge(followerId, followingId);
  }

  @EventHandler(NatsEvents.POST_CREATED)
  async onPostCreated({ userId, id, tags, createdAt }: PostCreatedEventPayload): Promise<void> {
    await this.socialService.boostTagWeight(userId, tags, WEIGHT_INTEREST_POST_CREATE);
    await this.socialService.trackPostCreation(userId, id, tags, createdAt.toISOString());
  }
}
