import { NatsEvents } from '../enums/nats-events.enum';

import { BaseEvent } from './base-event.abstract';

export interface PostLikedEventPayload {
  userId: number;
  postId: number;
  postOwnerId: number;
  content: string;
  createdAt: Date;
}

export class PostLikedEvent implements BaseEvent<PostLikedEventPayload> {
  public event: NatsEvents = NatsEvents.POST_LIKED;

  constructor(readonly data: PostLikedEventPayload) {}
}

export class PostUnlikedEvent implements BaseEvent<PostLikedEventPayload> {
  public event: NatsEvents = NatsEvents.POST_UNLIKED;

  constructor(readonly data: PostLikedEventPayload) {}
}
