import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Neo4jConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('neo4j.host');
  }
  get port(): number {
    return this.configService.get<number>('neo4j.port');
  }
  get username(): string {
    return this.configService.get<string>('neo4j.username');
  }
  get password(): string {
    return this.configService.get<string>('neo4j.password');
  }
  get protocol(): string {
    return this.configService.get<string>('neo4j.protocol');
  }
}
