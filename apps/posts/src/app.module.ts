import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseModule } from '@app/shared/database/database.module';
import { AsyncStorageMiddleware } from '@app/shared/middlewares/async-storage.middleware';
import { GraphqlRequestValidationPipe } from '@app/shared/pipes/graphql-request-validation.pipe';

import { PostsModule } from './posts/posts.module';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: () => ({
        driver: ApolloFederationDriver,
        plugins: [ApolloServerPluginInlineTrace()],
        autoSchemaFile: { federation: 2 },
      }),
    }),
    PostsModule,
  ],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_PIPE,
      useClass: GraphqlRequestValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
