import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { AppConfigModule } from '../app-config/app-config.module';

import { natsConfigLoader } from './configurations/loader';
import { NatsConfigService } from './configurations/nats-config.service';

import { EventBusEmitter } from './event-bus-emitter.service';
import { EventBusSubscriber } from './event-bus-subscriber.service';
import { NatsConnectionService } from './nats-connection.service';

@Module({})
export class NatsModule {
  static forRoot(): DynamicModule {
    return {
      module: NatsModule,
      imports: [ConfigModule.forFeature(natsConfigLoader), DiscoveryModule, AppConfigModule],
      providers: [NatsConfigService, NatsConnectionService, EventBusEmitter, EventBusSubscriber],
      exports: [EventBusEmitter, NatsConnectionService],
      global: true,
    };
  }
}
