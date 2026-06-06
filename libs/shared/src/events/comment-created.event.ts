import { NatsEvents } from '../enums/nats-events.enum';
import { IComment } from '../interfaces/comment/comment.interface';

import { BaseEvent } from './base-event.abstract';

export type CommentCreatedEventPayload = Pick<
  IComment,
  'id' | 'postId' | 'userId' | 'content' | 'createdAt'
> & {
  postOwnerId: number;
  tags: string[];
};

export class CommentCreatedEvent implements BaseEvent<CommentCreatedEventPayload> {
  public event: NatsEvents = NatsEvents.COMMENT_CREATED;

  constructor(readonly data: CommentCreatedEventPayload) {}
}
