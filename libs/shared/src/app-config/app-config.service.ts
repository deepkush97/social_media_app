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
}
