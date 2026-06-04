import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth/auth-jwt-payload.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { GatewayConfigService } from '../../config/gateway-config.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: GatewayConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: IAuthJWTPayload): Promise<ICurrentUser> {
    const sessionResult = await this.authService.getAuthSession(payload.sessionId);
    if (sessionResult.code !== AppCodes.OPERATION_SUCCESS) {
      throw new UnauthorizedException();
    }

    return sessionResult.data;
  }
}
