import { describe, expect, it, vi } from 'vitest';

import { NatsEvents } from '../enums/nats-events.enum';

import 'reflect-metadata';

import { EventHandler, NATS_EVENT_HANDLER_METADATA } from './event-handler.decorator';

function createDescriptor(): PropertyDescriptor {
  return { value: vi.fn(), writable: true, enumerable: true, configurable: true };
}

describe('EventHandler decorator', () => {
  it('sets metadata on the method', () => {
    const descriptor = createDescriptor();
    EventHandler(NatsEvents.POST_CREATED)({}, 'testMethod', descriptor);

    const metadata = Reflect.getMetadata(NATS_EVENT_HANDLER_METADATA, descriptor.value);

    expect(metadata).toBe(NatsEvents.POST_CREATED);
  });

  it('sets different metadata for different events', () => {
    const descriptor = createDescriptor();
    EventHandler(NatsEvents.USER_CREATED)({}, 'anotherMethod', descriptor);

    const metadata = Reflect.getMetadata(NATS_EVENT_HANDLER_METADATA, descriptor.value);

    expect(metadata).toBe(NatsEvents.USER_CREATED);
  });
});
