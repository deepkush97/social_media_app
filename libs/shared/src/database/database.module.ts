import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseLoggerService } from '@app/shared/app-logger/database-logger.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, DatabaseLoggerService],
      useFactory: (configService: ConfigService, logger: DatabaseLoggerService) => {
        const logging = configService.get<string>('DB_LOGGING') === 'true';
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
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
