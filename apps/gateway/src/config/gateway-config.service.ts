import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('gateway.jwtSecret');
  }
  get jwtExpirationTimeInSeconds(): number {
    return this.configService.get<number>('gateway.jwtExpirationTimeInSeconds');
  }
  get isSwaggerEnabled(): boolean {
    return this.configService.get<boolean>('gateway.isSwaggerEnabled');
  }
}
