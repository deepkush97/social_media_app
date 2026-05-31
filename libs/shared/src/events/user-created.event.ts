import { NatsEvents } from '../enums/nats-events.enum';
import { IUser } from '../interfaces/user/users.interface';

import { BaseEvent } from './base-event.abstract';

export type IUserCreateEventPayload = Pick<IUser, 'id' | 'name' | 'email'>;

export class UserCreatedEvent implements BaseEvent<IUserCreateEventPayload> {
  public event: NatsEvents = NatsEvents.USER_CREATED;

  constructor(readonly data: IUserCreateEventPayload) {}
}
