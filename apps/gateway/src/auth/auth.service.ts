import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth/auth-jwt-payload.interface';
import { IAuthProfileToken } from '@app/shared/interfaces/auth/auth-user.interface';
import {
  ICurrentUser,
  ILoginUser,
  INewUser,
  IUser,
} from '@app/shared/interfaces/user/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly routerComposite: GraphqlRouterComposite,
  ) {}

  async signup(input: INewUser): Promise<AppResponse<IAuthProfileToken>> {
    const createUserResult = await this.routerComposite.createUser(input, {
      code: 1,
      data: {
        id: 1,
        createdAt: 1,
        email: 1,
        name: 1,
      },
    });

    if (createUserResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[createUserResult.code] });
    }
    const { data: user } = createUserResult;
    const newSessionResult = await this.routerComposite.createNewSession(user.id, {
      code: 1,
      data: {
        guid: 1,
      },
    });

    if (newSessionResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[newSessionResult.code] });
    }

    const { data: session } = newSessionResult;

    const data = await this.generateProfilePayload(user, session.guid);

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data,
    });
  }

  async login(_input: ILoginUser): Promise<AppResponse<IAuthProfileToken>> {
    if (!false) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    // const isValidPassword = await this.bcryptService.validate(password, existingUser.password);

    // if (!isValidPassword) {
    //   this.loginCounter.inc({
    //     [MetricLabel.STATUS]: MetricStatus.FAIL,
    //     [MetricLabel.CAUSE]: MetricCause.INVALID_CREDENTIALS,
    //   });
    return new AppResponse({ code: AppCodes.INVALID_CREDENTIALS });
    // }

    // await this.sessionService.closeAllSession(existingUser.id);

    // const session = await this.sessionService.createNewSession(existingUser);

    // const data = await this.generateProfilePayload(existingUser, session.sessionId);

    // this.loginCounter.inc({
    //   [MetricLabel.STATUS]: MetricStatus.SUCCESS,
    // });

    // return new AppResponse({
    //   code: AppCodes.OPERATION_SUCCESS,
    //   data,
    // });
  }

  async logout(_user: ICurrentUser): Promise<boolean> {
    // return this.sessionService.closeSession(user.sessionId);
    return false;
  }

  private async generateProfilePayload(
    user: Omit<IUser, 'password' | 'updatedAt'>,
    sessionId: string,
  ): Promise<IAuthProfileToken> {
    const jwtPayload: IAuthJWTPayload = { sessionId };
    const jwtToken = await this.jwtService.signAsync(jwtPayload);

    return {
      profile: { ...user, sessionId },
      jwtToken,
    };
  }
}
