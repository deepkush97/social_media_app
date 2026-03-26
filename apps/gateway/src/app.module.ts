import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseModule } from '@app/shared/database/database.module';
import { GraphqlRouterModule } from '@app/shared/graphql/graphql-router.module';
import { AsyncStorageMiddleware } from '@app/shared/middlewares/async-storage.middleware';

import { AuthModule } from './auth/auth.module';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { RequestValidationPipe } from './pipes/request-validation.pipe';
import { PostsModule } from './posts/posts.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    GraphqlRouterModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          url: configService.graphqlRouterUrl,
        };
      },
    }),
    PostsModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
