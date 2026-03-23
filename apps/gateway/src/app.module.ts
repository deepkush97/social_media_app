import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseModule } from '@app/shared/database/database.module';
import { GlobalInterceptor } from '@app/shared/global.interceptor';
import { RequestValidationPipe } from '@app/shared/request-validation.pipe';

import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    AppLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe,
    },
  ],
})
export class AppModule {}
