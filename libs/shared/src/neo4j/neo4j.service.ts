import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { Driver, ManagedTransaction, Session } from 'neo4j-driver';

import { AppLoggerService } from '../app-logger/app-logger.service';
import { NEO4J_DRIVER } from '../providers.constant';

@Injectable()
export class Neo4jService implements OnModuleDestroy {
  constructor(
    @Inject(NEO4J_DRIVER)
    private readonly neo4jDriver: Driver,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.neo4jDriver.close();
  }

  async withSession<T>(fn: (session: Session) => Promise<T>, context: string): Promise<T> {
    const session = this.neo4jDriver.session();
    try {
      return await fn(session);
    } catch (error) {
      this.logger.error('Neo4j operation failed', { error, context });
      throw error;
    } finally {
      await session.close();
    }
  }

  async executeWrite<T>(fn: (tx: ManagedTransaction) => Promise<T>, context: string): Promise<T> {
    return this.withSession((session) => session.executeWrite(fn), context);
  }

  async executeRead<T>(fn: (tx: ManagedTransaction) => Promise<T>, context: string): Promise<T> {
    return this.withSession((session) => session.executeRead(fn), context);
  }
}
