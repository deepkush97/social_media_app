import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import {
  connect,
  ConsumerConfig,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
  StorageType,
} from 'nats';

import { AppLoggerService } from '../app-logger/app-logger.service';

import { NatsConfigService } from './configurations/nats-config.service';

const MAX_MSG_AGE_NS = 7 * 24 * 60 * 60 * 1_000_000_000;

export function streamName(event: string): string {
  return `${event.replace(/\./g, '-')}-stream`;
}

@Injectable()
export class NatsConnectionService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  constructor(
    private readonly configService: NatsConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.nc = await connect({ servers: this.configService.url });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();

    this.logger.info(`NATS connected at ${this.configService.url}`, {
      context: NatsConnectionService.name,
    });
  }

  get jetstream(): JetStreamClient {
    return this.js;
  }

  get jetstreamManager(): JetStreamManager {
    return this.jsm;
  }

  async ensureStream(sName: string, subject: string): Promise<void> {
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
      this.logger.info(`Created stream ${sName} for ${subject}`, {
        context: NatsConnectionService.name,
      });
    }
  }

  async ensurePullConsumer(
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
        context: NatsConnectionService.name,
      });
    } catch (error: unknown) {
      if (
        !(error instanceof Error) ||
        !error.message?.toLowerCase().includes('consumer already exists')
      ) {
        throw error;
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.nc?.drain();
    this.logger.info('NATS disconnected', { context: NatsConnectionService.name });
  }
}
