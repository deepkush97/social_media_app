import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { Logger } from 'nestjs-pino';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';

import { AuthModule } from './auth.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule, {
    bufferLogs: true,
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  const configService = app.get(ConfigService);
  const appLoggerService = await app.resolve(AppLoggerService);

  const PORT: string = configService.get('APP_PORT');

  await app.listen(+PORT);
  appLoggerService.info(`Auth service is running on port ${PORT}`, {
    context: 'Bootstrap',
  });
}
void bootstrap();
