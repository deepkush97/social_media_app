import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('db.host');
  }
  get port(): number {
    return this.configService.get<number>('db.port');
  }
  get user(): string {
    return this.configService.get<string>('db.user');
  }
  get pass(): string {
    return this.configService.get<string>('db.password');
  }
  get name(): string {
    return this.configService.get<string>('db.name');
  }
  get logging(): boolean {
    return this.configService.get<boolean>('db.logging');
  }
  get synchronize(): boolean {
    return this.configService.get<boolean>('db.synchronize');
  }
}
