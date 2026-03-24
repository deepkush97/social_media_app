import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';

import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { DatabaseModule } from '@app/shared/database/database.module';
import { GraphqlRouterModule } from '@app/shared/graphql/graphql-router.module';

import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    DatabaseModule,
    UserModule,
    BcryptModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      plugins: [ApolloServerPluginInlineTrace()],
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'libs/shared/src/graphql/schema/auth.graphql'),
      },
    }),
    SessionModule,
    GraphqlRouterModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          url: configService.graphqlRouterUrl,
        };
      },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
