import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppEnvironment } from '../enums/app-environment.enum';
import { AppLogLevel } from '../enums/app-log-level.enum';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): AppEnvironment {
    return this.configService.get<AppEnvironment>('app.env');
  }
  get name(): string {
    return this.configService.get<string>('app.name');
  }
  get port(): number {
    return this.configService.get<number>('app.port');
  }
  get logLevel(): AppLogLevel {
    return this.configService.get<AppLogLevel>('app.logLevel');
  }
  get dbHost(): string {
    return this.configService.get<string>('app.dbHost');
  }
  get dbPort(): number {
    return this.configService.get<number>('app.dbPort');
  }
  get dbUser(): string {
    return this.configService.get<string>('app.dbUser');
  }
  get dbPass(): string {
    return this.configService.get<string>('app.dbPass');
  }
  get dbName(): string {
    return this.configService.get<string>('app.dbName');
  }
  get dbLogging(): boolean {
    return this.configService.get<boolean>('app.dbLogging');
  }
  get jwtSecret(): string {
    return this.configService.get<string>('app.jwtSecret');
  }
  get jwtExpirationTimeInSeconds(): number {
    return this.configService.get<number>('app.jwtExpirationTimeInSeconds');
  }
  get redisHost(): string {
    return this.configService.get<string>('app.redisHost');
  }
  get redisPort(): number {
    return this.configService.get<number>('app.redisPort');
  }
  get redisPassword(): string {
    return this.configService.get<string>('app.redisPassword');
  }
}
