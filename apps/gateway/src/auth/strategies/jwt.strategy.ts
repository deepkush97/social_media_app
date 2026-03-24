import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '@app/shared/app-config/app-config.service';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth/auth-jwt-payload.interface';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: AppConfigService,
    // private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(_payload: IAuthJWTPayload): Promise<ICurrentUser> {
    const session = null;
    // await this.sessionService.findSessionByGuid(payload.sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }

    return session;
  }
}
