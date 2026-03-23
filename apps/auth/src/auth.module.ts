import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';

import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

import { AppConfigModule } from '@app/shared/app-config/app-config.module';
import { AppLoggerModule } from '@app/shared/app-logger/app-logger.module';
import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { DatabaseModule } from '@app/shared/database/database.module';

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
        path: join(process.cwd(), 'libs/shared/src/schema/auth.graphql'),
      },
    }),
    SessionModule,
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
