import { NatsEvents } from '../enums/nats-events.enum';

import { BaseEvent } from './base-event.abstract';

export interface UserFollowedEventPayload {
  followerId: number;
  followingId: number;
  createdAt: string;
}

export class UserFollowedEvent implements BaseEvent<UserFollowedEventPayload> {
  public event: NatsEvents = NatsEvents.USER_FOLLOWED;

  constructor(readonly data: UserFollowedEventPayload) {}
}

export class UserUnfollowedEvent implements BaseEvent<UserFollowedEventPayload> {
  public event: NatsEvents = NatsEvents.USER_UNFOLLOWED;

  constructor(readonly data: UserFollowedEventPayload) {}
}
