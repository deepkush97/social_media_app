import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseLoggerService } from '@app/shared/app-logger/database-logger.service';

import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService, DatabaseLoggerService],
      useFactory: (configService: AppConfigService, logger: DatabaseLoggerService) => {
        const logging = configService.dbLogging;
        return {
          type: 'mysql',
          host: configService.dbHost,
          port: configService.dbPort,
          username: configService.dbUser,
          password: configService.dbPass,
          database: configService.dbName,
          logging,
          autoLoadEntities: true,
          logger: logging ? logger : null,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
