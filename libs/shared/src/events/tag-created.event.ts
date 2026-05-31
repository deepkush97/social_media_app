import { NatsEvents } from '../enums/nats-events.enum';

import { BaseEvent } from './base-event.abstract';

export type TagCreatedEventPayload = { tags: { id: number; name: string }[] };

export class TagCreatedEvent implements BaseEvent<TagCreatedEventPayload> {
  public event: NatsEvents = NatsEvents.TAG_CREATED;

  constructor(readonly data: TagCreatedEventPayload) {}
}
