import { NatsEvents } from '../enums/nats-events.enum';
import { IPost } from '../interfaces/post/post.interface';

import { BaseEvent } from './base-event.abstract';

export type PostCreatedEventPayload = Pick<IPost, 'content' | 'title' | 'userId' | 'id'>;

export class PostCreatedEvent implements BaseEvent<PostCreatedEventPayload> {
  public event: NatsEvents = NatsEvents.POST_CREATED;

  constructor(readonly data: PostCreatedEventPayload) {}
}
