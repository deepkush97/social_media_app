import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { GraphqlConfigService } from '@app/shared/graphql/configurations/graphql-config.service';
import { GraphqlRouterModule } from '@app/shared/graphql/graphql-router.module';
import { AsyncStorageMiddleware } from '@app/shared/middlewares/async-storage.middleware';
import { NatsModule } from '@app/shared/nats/nats.module';
import { GatewayRequestValidationPipe } from '@app/shared/pipes/gateway-request-validation.pipe';

import { AuthModule } from './auth/auth.module';
import { GatewayConfigModule } from './config/gateway-config.module';
import { FeedModule } from './feed/feed.module';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { LikesModule } from './likes/likes.module';
import { metricsProviders } from './metrics/metrics.providers';
import { PostsModule } from './posts/posts.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
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
    GatewayConfigModule,
    NatsModule.forRoot(),
    AuthModule,
    GraphqlRouterModule.registerAsync({
      inject: [GraphqlConfigService],
      useFactory: (configService: GraphqlConfigService) => {
        return {
          url: configService.url,
        };
      },
    }),
    FeedModule,
    PostsModule,
    RecommendationsModule,
    UsersModule,
    LikesModule,
    SearchModule,
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
    }),
  ],
  controllers: [AppController],
  providers: [
    ...metricsProviders,
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
