import { describe, expect, it } from 'vitest';

import { NatsEvents } from '../enums/nats-events.enum';

import { BaseEvent } from './base-event.abstract';
import { PostCreatedEvent, PostCreatedEventPayload } from './post-created.event';
import { UserCreatedEvent } from './user-created.event';

describe('BaseEvent', () => {
  it('stores data passed to constructor', () => {
    const data = { key: 'value' };

    class TestEvent extends BaseEvent<typeof data> {
      event = NatsEvents.POST_CREATED;
    }

    const event = new TestEvent(data);

    expect(event.data).toBe(data);
  });
});

describe('PostCreatedEvent', () => {
  it('has the correct event type', () => {
    const event = new PostCreatedEvent({
      id: 1,
      title: 'Test',
      content: 'Content',
      userId: 42,
      createdAt: new Date().toISOString(),
      tags: ['content'],
    });

    expect(event.event).toBe(NatsEvents.POST_CREATED);
  });

  it('stores the post data', () => {
    const data: PostCreatedEventPayload = {
      id: 1,
      title: 'My Post',
      content: 'Post content',
      userId: 42,
      createdAt: new Date().toISOString(),
      tags: ['content'],
    };
    const event = new PostCreatedEvent(data);

    expect(event.data).toEqual(data);
  });
});

describe('UserCreatedEvent', () => {
  it('has the correct event type', () => {
    const event = new UserCreatedEvent({ id: 1, name: 'Alice', email: 'alice@test.com' });

    expect(event.event).toBe(NatsEvents.USER_CREATED);
  });

  it('stores the user data', () => {
    const data = { id: 1, name: 'Alice', email: 'alice@test.com' };
    const event = new UserCreatedEvent(data);

    expect(event.data).toEqual(data);
  });
});
