import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseLoggerService } from '@app/shared/app-logger/database-logger.service';

import { DatabaseConfigService } from './configurations/database-config.service';
import { dbConfigLoader } from './configurations/loader';

@Module({
  imports: [
    ConfigModule.forFeature(dbConfigLoader),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule.forFeature(dbConfigLoader)],
      inject: [DatabaseConfigService, DatabaseLoggerService],
      useFactory: (configService: DatabaseConfigService, logger: DatabaseLoggerService) => {
        const logging = configService.logging;
        const synchronize = configService.synchronize;

        return {
          type: 'mysql',
          host: configService.host,
          port: configService.port,
          username: configService.user,
          password: configService.pass,
          database: configService.name,
          logging,
          autoLoadEntities: true,
          logger: logging ? logger : null,
          synchronize,
        };
      },
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
