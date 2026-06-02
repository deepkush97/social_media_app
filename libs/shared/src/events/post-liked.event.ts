import { NatsEvents } from '../enums/nats-events.enum';
import { IPost } from '../interfaces/post/post.interface';

import { BaseEvent } from './base-event.abstract';

export type PostLikedEventPayload = Pick<IPost, 'userId' | 'tags'> & {
  postOwnerId: number;
};

export class PostLikedEvent implements BaseEvent<PostLikedEventPayload> {
  public event: NatsEvents = NatsEvents.POST_LIKED;

  constructor(readonly data: PostLikedEventPayload) {}
}

export class PostUnlikedEvent implements BaseEvent<PostLikedEventPayload> {
  public event: NatsEvents = NatsEvents.POST_UNLIKED;

  constructor(readonly data: PostLikedEventPayload) {}
}
