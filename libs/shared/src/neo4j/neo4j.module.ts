import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import neo4j, { Driver } from 'neo4j-driver';

import { NEO4J_DRIVER } from '../providers.constant';

import { neo4jConfigLoader } from './configurations/loader';
import { Neo4jConfigService } from './configurations/neo4j-config.service';

import { Neo4jService } from './neo4j.service';

@Module({
  imports: [ConfigModule.forFeature(neo4jConfigLoader)],
  providers: [Neo4jConfigService],
  exports: [Neo4jConfigService],
})
export class Neo4jModule {
  static forRoot(): DynamicModule {
    return {
      module: Neo4jModule,
      providers: [
        {
          provide: NEO4J_DRIVER,
          inject: [Neo4jConfigService],
          useFactory: (config: Neo4jConfigService): Driver => {
            const host = config.host;
            const port = config.port;
            const protocol = config.protocol;
            const username = config.username;
            const password = config.password;

            return neo4j.driver(
              `${protocol}://${host}:${port}`,
              neo4j.auth.basic(username, password),
            );
          },
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
