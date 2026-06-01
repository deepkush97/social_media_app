import { NatsEvents } from '../enums/nats-events.enum';

export abstract class BaseEvent<T = unknown> {
  public abstract event: NatsEvents;

  constructor(readonly data: T) {}
}
