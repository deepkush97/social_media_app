import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';

import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseModule } from '@app/shared/database/database.module';
import { AsyncStorageMiddleware } from '@app/shared/middlewares/async-storage.middleware';
import { NatsModule } from '@app/shared/nats/nats.module';
import { GraphqlRequestValidationPipe } from '@app/shared/pipes/graphql-request-validation.pipe';

import { SocialModule } from './social/social.module';
import { WeightDecayModule } from './weight-decay/weight-decay.module';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const name = configService.name;
        return {
          driver: ApolloFederationDriver,
          plugins: [ApolloServerPluginInlineTrace()],
          autoSchemaFile: {
            federation: 2,
            path: join(process.cwd(), `libs/shared/src/graphql/schema/${name}.graphql`),
          },
        };
      },
    }),
    NatsModule.forRoot(),
    SocialModule,
    WeightDecayModule,
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
