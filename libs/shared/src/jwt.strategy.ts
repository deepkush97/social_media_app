import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { SessionService } from '@app/session/session.service';

import { IAuthJWTPayload } from './interfaces/auth/auth-jwt-payload.interface';
import { ICurrentUser } from './interfaces/user/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IAuthJWTPayload): Promise<ICurrentUser> {
    const session = await this.sessionService.findSessionByGuid(payload.sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }

    return session;
  }
}
