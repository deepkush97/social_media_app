import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';

import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { DatabaseModule } from '@app/shared/database/database.module';

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
    PostsModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {}
