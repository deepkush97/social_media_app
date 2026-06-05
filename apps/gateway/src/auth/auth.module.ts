import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { BcryptModule } from '@app/shared/bcrypt/bcrypt.module';
import { CacheModule } from '@app/shared/cache/cache.module';

import { GatewayConfigModule } from '../config/gateway-config.module';
import { GatewayConfigService } from '../config/gateway-config.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    GatewayConfigModule,
    BcryptModule,
    CacheModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [GatewayConfigModule],
      useFactory: (configService: GatewayConfigService) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: configService.jwtExpirationTimeInSeconds,
          },
        };
      },
      inject: [GatewayConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
