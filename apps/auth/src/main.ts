import { NestFactory } from '@nestjs/core';

import { Logger } from 'nestjs-pino';

import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';

import { AuthModule } from './auth.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule, {
    bufferLogs: true,
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  const appConfigService = app.get(AppConfigService);
  const appLoggerService = await app.resolve(AppLoggerService);

  const PORT = appConfigService.port;

  await app.listen(PORT);
  appLoggerService.info(`Auth service is running on port ${PORT}`, {
    context: 'Bootstrap',
  });
}
void bootstrap();
