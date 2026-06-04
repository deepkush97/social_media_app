import { NatsEvents } from '../enums/nats-events.enum';

import { BaseEvent } from './base-event.abstract';

export enum SearchRetryType {
  INDEX_POST = 'INDEX_POST',
  INDEX_BULK_TAGS = 'INDEX_BULK_TAGS',
  INDEX_USER = 'INDEX_USER',
}

export interface SearchIndexRetryPayload {
  retryType: SearchRetryType;
  payload: Record<string, unknown>;
  retryCount: number;
}

export class SearchIndexRetryEvent implements BaseEvent<SearchIndexRetryPayload> {
  public event: NatsEvents = NatsEvents.SEARCH_INDEX_RETRY;

  constructor(readonly data: SearchIndexRetryPayload) {}
}
