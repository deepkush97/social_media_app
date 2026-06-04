import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { gatewayConfigLoader } from './configuration';
import { GatewayConfigService } from './gateway-config.service';

@Module({
  imports: [ConfigModule.forFeature(gatewayConfigLoader)],
  providers: [GatewayConfigService],
  exports: [GatewayConfigService],
})
export class GatewayConfigModule {}
