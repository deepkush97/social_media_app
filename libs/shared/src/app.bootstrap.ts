import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Logger } from 'nestjs-pino';

import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';

export const appBootstrap = async (module: Type<unknown>): Promise<void> => {
  const isGeneratingSchema = process.env.GENERATE_SCHEMA === 'true';
  const serviceName = process.env.SERVICE;

  if (isGeneratingSchema) {
    const app = await NestFactory.create(module, { logger: false });
    await app.init();
    // eslint-disable-next-line no-console
    console.log(`Successfully generated schema for ${serviceName}`);
    await app.close();
    process.exit(0);
  }

  const app = await NestFactory.create(module, { bufferLogs: true });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  const appConfigService = app.get(AppConfigService);
  const appLoggerService = await app.resolve(AppLoggerService);

  const port = appConfigService.port;

  await app.listen(port);
  appLoggerService.info(`${serviceName} service is running on port ${port}`, {
    context: 'Bootstrap',
  });
};
