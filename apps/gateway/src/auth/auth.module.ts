import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { CacheModule } from '@app/shared/cache/cache.module';
import { JwtStrategy } from '@app/shared/jwt.strategy';

import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    SessionModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
