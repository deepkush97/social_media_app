import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { Logger } from 'nestjs-pino';

import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';

import { version } from '../../../package.json';

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

  const isSwaggerEnabled = appConfigService.isSwaggerEnabled;
  if (isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Social media app')
      .setDescription('API documentation for social media app')
      .setVersion(version)
      .addBearerAuth()
      .build();
    const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.enableCors();
  await app.listen(port);
  appLoggerService.info(`${serviceName} service is running on port ${port}`, {
    context: 'Bootstrap',
  });
};
