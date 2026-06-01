import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { GraphqlRouterModule } from '@app/shared/graphql/graphql-router.module';
import { AsyncStorageMiddleware } from '@app/shared/middlewares/async-storage.middleware';
import { NatsModule } from '@app/shared/nats/nats.module';
import { GatewayRequestValidationPipe } from '@app/shared/pipes/gateway-request-validation.pipe';

import { AuthModule } from './auth/auth.module';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NatsModule.forRoot(),
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
    UsersModule,
    LikesModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: GatewayRequestValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
