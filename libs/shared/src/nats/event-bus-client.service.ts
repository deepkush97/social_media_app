import { Injectable, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import {
  connect,
  ConsumerConfig,
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  RetentionPolicy,
  StorageType,
} from 'nats';

import { AppConfigService } from '../app-config/app-config.service';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { NatsEvents } from '../enums/nats-events.enum';
import { BaseEvent } from '../events/base-event.abstract';

import { NatsConfigService } from './configurations/nats-config.service';

import { NATS_EVENT_HANDLER_METADATA } from './event-handler.decorator';

const MAX_MSG_AGE_NS = 7 * 24 * 60 * 60 * 1_000_000_000;

function streamName(event: string): string {
  return `${event.replace(/\./g, '-')}-stream`;
}

interface HandlerEntry {
  instance: unknown;
  methodName: string;
  event: NatsEvents;
}

@Injectable()
export class EventBusClient implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private jc = JSONCodec();
  private handlers: HandlerEntry[] = [];
  private active = false;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly configService: NatsConfigService,
    private readonly logger: AppLoggerService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nc = await connect({ servers: this.configService.url });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();

    this.logger.info(`NATS EventBus connected at ${this.configService.url}`, {
      context: EventBusClient.name,
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.autoSubscribe();
  }

  private async autoSubscribe(): Promise<void> {
    this.collectHandlers();

    const grouped = new Map<NatsEvents, HandlerEntry[]>();
    for (const handler of this.handlers) {
      const list = grouped.get(handler.event) ?? [];
      list.push(handler);
      grouped.set(handler.event, list);
    }

    if (grouped.size === 0) {
      this.logger.info('No event handlers found, skipping subscriptions', {
        context: EventBusClient.name,
      });
      return;
    }

    this.active = true;

    for (const [event, eventHandlers] of grouped) {
      const sName = streamName(event);
      await this.ensureStream(sName, event);
      const consumerName = `${this.appConfigService.name}-${event.replace(/\./g, '-')}`;
      await this.ensurePullConsumer(sName, consumerName, event);
      this.startPullLoop(sName, consumerName, event, eventHandlers);
    }

    this.logger.info(
      `${this.appConfigService.name} subscribed to ${grouped.size} event(s): ${[...grouped.keys()].join(', ')}`,
      { context: EventBusClient.name },
    );
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

  private async ensureStream(sName: string, subject: string): Promise<void> {
    const streams = await this.jsm.streams.list().next();
    const existing = streams.find((s) => s.config.name === sName);

    if (!existing) {
      await this.jsm.streams.add({
        name: sName,
        subjects: [subject],
        max_age: MAX_MSG_AGE_NS,
        storage: StorageType.File,
        retention: RetentionPolicy.Limits,
      });
      this.logger.info(`Created stream ${sName} for ${subject}`, { context: EventBusClient.name });
    }
  }

  private async ensurePullConsumer(
    sName: string,
    consumerName: string,
    filterSubject: string,
  ): Promise<void> {
    try {
      await this.jsm.consumers.add(sName, {
        durable_name: consumerName,
        ack_policy: 'explicit',
        deliver_policy: 'new',
        filter_subject: filterSubject,
        max_deliver: 3,
        ack_wait: 30_000_000_000,
      } as ConsumerConfig);
      this.logger.info(`Created pull consumer ${consumerName} on ${sName} for ${filterSubject}`, {
        context: EventBusClient.name,
      });
    } catch {
      // consumer already exists
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
        const c = await this.js.consumers.get(sName, consumerName);
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
              context: EventBusClient.name,
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
          context: EventBusClient.name,
        });

        if (this.active) {
          void poll(nextBackoff);
        }
      }
    };

    void poll(0);
  }

  async emit({ data, event }: BaseEvent, context: string): Promise<void> {
    await this.js
      .publish(event, this.jc.encode(data))
      .then(() => {
        this.logger.info(`Emitted ${event}`, { context: EventBusClient.name });
      })
      .catch((error) => {
        this.logger.error(`Error while emitting the event: ${event}`, {
          error,
          data,
          context,
        });
      });
  }

  async onModuleDestroy(): Promise<void> {
    this.active = false;
    await this.nc?.drain();
    this.logger.info('NATS EventBus disconnected', { context: EventBusClient.name });
  }
}
