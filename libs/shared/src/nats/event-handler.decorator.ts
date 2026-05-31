import { SetMetadata } from '@nestjs/common';

import { NatsEvents } from '../enums/nats-events.enum';

export const NATS_EVENT_HANDLER_METADATA = 'nats_event_handler';

export const EventHandler = (event: NatsEvents): MethodDecorator =>
  SetMetadata(NATS_EVENT_HANDLER_METADATA, event);
