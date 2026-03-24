import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppResponse } from '@app/shared/app-response.dto';
import { CacheService } from '@app/shared/cache/cache.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { GraphqlRouterComposite } from '@app/shared/graphql/graphql-router.composite';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth/auth-jwt-payload.interface';
import { IAuthProfileToken } from '@app/shared/interfaces/auth/auth-user.interface';
import {
  ICurrentUser,
  ILoginUser,
  INewUser,
  IUser,
} from '@app/shared/interfaces/user/users.interface';

import { CACHE_TTL_IN_SECONDS } from '../app.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly routerComposite: GraphqlRouterComposite,
    private readonly cacheService: CacheService,
  ) {}

  private createSessionCacheKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

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

    const jwtToken = await this.generateJwtToken(session.guid);
    const profile = this.prepareProfilePayload(session.guid, user);

    await this.cacheService.set(
      this.createSessionCacheKey(session.guid),
      profile,
      CACHE_TTL_IN_SECONDS,
    );

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data: {
        jwtToken,
        profile,
      },
    });
  }

  async login(input: ILoginUser): Promise<AppResponse<IAuthProfileToken>> {
    const loginUserResult = await this.routerComposite.loginUser(input, {
      code: 1,
      data: {
        id: 1,
        createdAt: 1,
        email: 1,
        name: 1,
      },
    });
    if (loginUserResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[loginUserResult.code] });
    }
    const user = loginUserResult.data;

    await this.routerComposite.closeAllOpenSessionByUserId(user.id, { code: 1 });

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

    const jwtToken = await this.generateJwtToken(session.guid);
    const profile = this.prepareProfilePayload(session.guid, user);

    await this.cacheService.set(
      this.createSessionCacheKey(session.guid),
      profile,
      CACHE_TTL_IN_SECONDS,
    );

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: {
        jwtToken,
        profile,
      },
    });
  }

  async logout(sessionId: string): Promise<boolean> {
    await this.routerComposite.closeSessionBySessionId(sessionId, { code: 1 });

    return true;
  }

  private async generateJwtToken(sessionId: string): Promise<string> {
    const jwtPayload: IAuthJWTPayload = { sessionId };
    return this.jwtService.signAsync(jwtPayload);
  }

  public async getAuthSession(sessionId: string): Promise<IAppResponse<ICurrentUser>> {
    const sessionCacheKey = this.createSessionCacheKey(sessionId);

    const data = await this.cacheService.get<ICurrentUser>(sessionCacheKey);

    if (data) {
      return new AppResponse({
        code: AppCodes.OPERATION_SUCCESS,
        data,
      });
    }

    const findSessionResult = await this.routerComposite.findOpenSessionByGuid(sessionId, {
      code: 1,
      data: {
        userId: 1,
      },
    });

    if (findSessionResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[findSessionResult.code] });
    }

    const { userId } = findSessionResult.data;

    const userResult = await this.routerComposite.findUserById(userId, {
      code: 1,
      data: {
        email: 1,
        id: 1,
        name: 1,
        createdAt: 1,
      },
    });

    if (userResult.code !== AppCodes.OPERATION_SUCCESS) {
      return new AppResponse({ code: AppCodes[userResult.code] });
    }

    const profile = this.prepareProfilePayload(sessionId, userResult.data);
    await this.cacheService.set(sessionCacheKey, profile, CACHE_TTL_IN_SECONDS);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: profile,
    });
  }

  private prepareProfilePayload(
    sessionId: string,
    user: Omit<IUser, 'password' | 'updatedAt'>,
  ): ICurrentUser {
    const sessionPayload = { ...user, sessionId };
    return sessionPayload;
  }
}
