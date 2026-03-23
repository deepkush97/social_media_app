import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './app-config.service';
import { configLoader } from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      envFilePath: [`.env.${process.env.SERVICE}`],
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
