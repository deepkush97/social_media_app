import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { JSONCodec } from 'nats';

import { AppConfigService } from '../app-config/app-config.service';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { NatsEvents } from '../enums/nats-events.enum';

import { NATS_EVENT_HANDLER_METADATA } from './event-handler.decorator';
import { NatsConnectionService, streamName } from './nats-connection.service';

interface HandlerEntry {
  instance: unknown;
  methodName: string;
  event: NatsEvents;
}

@Injectable()
export class EventBusSubscriber implements OnApplicationBootstrap {
  private jc = JSONCodec();
  private handlers: HandlerEntry[] = [];
  private active = false;

  constructor(
    private readonly natsConnection: NatsConnectionService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: AppLoggerService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.autoSubscribe();
  }

  private async autoSubscribe(): Promise<void> {
    this.collectHandlers();

    const grouped = new Map<NatsEvents, HandlerEntry[]>();
    const handledEvents = new Set<string>();
    for (const handler of this.handlers) {
      const list = grouped.get(handler.event) ?? [];
      list.push(handler);
      grouped.set(handler.event, list);
      handledEvents.add(handler.event);
    }

    await this.warnOrphanStreams(handledEvents);

    if (grouped.size === 0) {
      this.logger.info('No event handlers found, skipping subscriptions', {
        context: EventBusSubscriber.name,
      });
      return;
    }

    this.active = true;

    for (const [event, eventHandlers] of grouped) {
      const sName = streamName(event);
      await this.natsConnection.ensureStream(sName, event);
      const consumerName = `${this.appConfigService.name}-${event.replace(/\./g, '-')}`;
      await this.natsConnection.ensurePullConsumer(sName, consumerName, event);
      this.startPullLoop(sName, consumerName, event, eventHandlers);
    }

    this.logger.info(
      `${this.appConfigService.name} subscribed to ${grouped.size} event(s): ${[...grouped.keys()].join(', ')}`,
      { context: EventBusSubscriber.name },
    );
  }

  private async warnOrphanStreams(handledEvents: Set<string>): Promise<void> {
    try {
      const streams = await this.natsConnection.jetstreamManager.streams.list().next();
      for (const stream of streams) {
        for (const subject of stream.config.subjects ?? []) {
          if (!handledEvents.has(subject)) {
            this.logger.warn(
              `Stream "${stream.config.name}" exists for subject "${subject}" but no @EventHandler handles it — ` +
                'messages published to this subject will never be processed',
              { context: EventBusSubscriber.name },
            );
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to list NATS streams for orphan check', {
        context: EventBusSubscriber.name,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  private collectHandlers(): void {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => {
        if (name === 'constructor') return false;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
        return descriptor && typeof descriptor.value === 'function';
      });

      for (const methodName of methodNames) {
        const event = this.reflector.get<NatsEvents>(
          NATS_EVENT_HANDLER_METADATA,
          prototype[methodName],
        );
        if (event) {
          this.handlers.push({ instance, methodName, event });
        }
      }
    }
  }

  private startPullLoop(
    sName: string,
    consumerName: string,
    event: NatsEvents,
    eventHandlers: HandlerEntry[],
  ): void {
    const poll = async (backoffMs = 0): Promise<void> => {
      if (!this.active) return;

      if (backoffMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }

      try {
        const c = await this.natsConnection.jetstream.consumers.get(sName, consumerName);
        const msgs = await c.fetch({ max_messages: 10, expires: 5_000 });

        for await (const msg of msgs) {
          try {
            const data = this.jc.decode(msg.data);

            for (const handler of eventHandlers) {
              await handler.instance[handler.methodName](data);
            }

            msg.ack();
          } catch (err) {
            this.logger.error(`Error processing event ${event}`, {
              context: EventBusSubscriber.name,
              error: err instanceof Error ? err.message : err,
            });
            msg.nak();
          }
        }

        if (this.active) {
          void poll(0);
        }
      } catch {
        const nextBackoff = backoffMs === 0 ? 1_000 : Math.min(backoffMs * 2, 30_000);
        this.logger.error(`NATS poll failed for ${event}, retrying in ${nextBackoff}ms`, {
          context: EventBusSubscriber.name,
        });

        if (this.active) {
          void poll(nextBackoff);
        }
      }
    };

    void poll(0);
  }
}
