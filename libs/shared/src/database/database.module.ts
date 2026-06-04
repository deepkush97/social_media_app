import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseLoggerService } from '@app/shared/app-logger/database-logger.service';

import { DatabaseConfigModule } from './configurations/database-config.module';
import { DatabaseConfigService } from './configurations/database-config.service';

@Module({
  imports: [
    DatabaseConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
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
})
export class DatabaseModule {}
