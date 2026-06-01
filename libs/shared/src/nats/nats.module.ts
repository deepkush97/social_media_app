import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { AppConfigModule } from '../app-config/app-config.module';

import { natsConfigLoader } from './configurations/loader';
import { NatsConfigService } from './configurations/nats-config.service';

import { EventBusClient } from './event-bus-client.service';

@Module({})
export class NatsModule {
  static forRoot(): DynamicModule {
    return {
      module: NatsModule,
      imports: [ConfigModule.forFeature(natsConfigLoader), DiscoveryModule, AppConfigModule],
      providers: [NatsConfigService, EventBusClient],
      exports: [EventBusClient],
      global: true,
    };
  }
}
