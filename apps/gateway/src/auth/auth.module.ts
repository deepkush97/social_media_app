import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from 'apps/gateway/src/auth/strategies/jwt.strategy';

import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { CacheModule } from '@app/shared/cache/cache.module';
import { GraphqlRouterModule } from '@app/shared/graphql/graphql-router.module';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    BcryptModule,
    CacheModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: parseInt(configService.getOrThrow('JWT_EXPIRATION_TIME_IN_SECONDS')),
          },
        };
      },
      inject: [ConfigService],
    }),
    GraphqlRouterModule.registerAsync({
      useFactory: (configService: AppConfigService) => {
        return {
          url: configService.graphqlRouterUrl,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
