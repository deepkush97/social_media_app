import { Injectable } from '@nestjs/common';

import { JSONCodec } from 'nats';

import { AppLoggerService } from '../app-logger/app-logger.service';
import { BaseEvent } from '../events/base-event.abstract';

import { NatsConnectionService } from './nats-connection.service';

@Injectable()
export class EventBusEmitter {
  private jc = JSONCodec();

  constructor(
    private readonly natsConnection: NatsConnectionService,
    private readonly logger: AppLoggerService,
  ) {}

  async emit({ data, event }: BaseEvent, context: string): Promise<void> {
    try {
      await this.natsConnection.jetstream.publish(event, this.jc.encode(data));
      this.logger.info(`Emitted ${event}`, { context: EventBusEmitter.name });
    } catch (error) {
      this.logger.error(`Error while emitting the event: ${event}`, {
        error,
        data,
        context,
      });
      throw error;
    }
  }
}
