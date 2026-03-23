import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth/auth-jwt-payload.interface';
import { IAuthProfileToken } from '@app/shared/interfaces/auth/auth-user.interface';
import {
  ICurrentUser,
  ILoginUser,
  INewUser,
  IUser,
} from '@app/shared/interfaces/user/users.interface';
import {
  MetricCause,
  MetricLabel,
  MetricName,
  MetricStatus,
} from '@app/shared/metrics/metrics.constant';

import { SessionService } from '../session/session.service';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    @InjectMetric(MetricName.LOGIN_TOTAL)
    private readonly loginCounter: Counter<MetricLabel>,
    @InjectMetric(MetricName.REGISTRATION_TOTAL)
    private readonly signupCounter: Counter<MetricLabel>,
  ) {}

  async signup({ name, email, password }: INewUser): Promise<AppResponse<IAuthProfileToken>> {
    const isExists = await this.userService.findByEmail(email);
    if (isExists) {
      this.signupCounter.inc({
        [MetricLabel.STATUS]: MetricStatus.FAIL,
        [MetricLabel.CAUSE]: MetricCause.INVALID_EMAIL,
      });
      return new AppResponse({ code: AppCodes.INVALID_EMAIL });
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    const session = await this.sessionService.createNewSession(user);

    const data = await this.generateProfilePayload(user, session.sessionId);

    this.signupCounter.inc({
      [MetricLabel.STATUS]: MetricStatus.SUCCESS,
    });

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data,
    });
  }

  async login({ email, password }: ILoginUser): Promise<AppResponse<IAuthProfileToken>> {
    const existingUser = await this.userService.findByEmail(email, {
      name: true,
      password: true,
      email: true,
      createdAt: true,
      id: true,
    });

    if (!existingUser) {
      this.loginCounter.inc({
        [MetricLabel.STATUS]: MetricStatus.FAIL,
        [MetricLabel.CAUSE]: MetricCause.BAD_REQUEST,
      });
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    const isValidPassword = await this.bcryptService.validate(password, existingUser.password);

    if (!isValidPassword) {
      this.loginCounter.inc({
        [MetricLabel.STATUS]: MetricStatus.FAIL,
        [MetricLabel.CAUSE]: MetricCause.INVALID_CREDENTIALS,
      });
      return new AppResponse({ code: AppCodes.INVALID_CREDENTIALS });
    }

    await this.sessionService.closeAllSession(existingUser.id);

    const session = await this.sessionService.createNewSession(existingUser);

    const data = await this.generateProfilePayload(existingUser, session.sessionId);

    this.loginCounter.inc({
      [MetricLabel.STATUS]: MetricStatus.SUCCESS,
    });

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  async logout(user: ICurrentUser): Promise<boolean> {
    return this.sessionService.closeSession(user.sessionId);
  }

  private async generateProfilePayload(user: IUser, sessionId: string): Promise<IAuthProfileToken> {
    const { password: _, updatedAt: __, ...rest } = user;
    const jwtPayload: IAuthJWTPayload = { sessionId };
    const jwtToken = await this.jwtService.signAsync(jwtPayload);

    return {
      profile: { ...rest, sessionId },
      jwtToken,
    };
  }
}
