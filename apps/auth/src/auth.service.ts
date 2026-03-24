import { Injectable } from '@nestjs/common';

import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { ISession } from '@app/shared/interfaces/session/session.interface';
import { ILoginUser, INewUser, IUser } from '@app/shared/interfaces/user/users.interface';

import { SessionService } from './session/session.service';
import { UsersService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
    private readonly bcryptService: BcryptService,
  ) {}

  async createUser({ name, email, password }: INewUser): Promise<IAppResponse<IUser>> {
    const isExists = await this.userService.findByEmail(email);
    if (isExists) {
      return new AppResponse({ code: AppCodes.INVALID_EMAIL });
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: user,
    });
  }

  async loginUser({ email, password }: ILoginUser): Promise<IAppResponse<IUser>> {
    const existingPlayer = await this.userService.findByEmail(email, {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      password: true,
      updatedAt: true,
    });
    if (!existingPlayer) {
      return new AppResponse({ code: AppCodes.INVALID_CREDENTIALS });
    }

    const isValid = await this.bcryptService.validate(password, existingPlayer.password);
    if (!isValid) {
      return new AppResponse({ code: AppCodes.INVALID_CREDENTIALS });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: existingPlayer,
    });
  }

  async findUserById(id: number): Promise<IAppResponse<IUser>> {
    const data = await this.userService.findOneById(id);
    if (!data) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS, data });
  }

  async createSession(userId: number): Promise<IAppResponse<ISession>> {
    const session = await this.sessionService.createNewSession(userId);
    if (!session) {
      return new AppResponse({
        code: AppCodes.BAD_REQUEST,
      });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: session,
    });
  }

  async closeAllOpenSessionByUserId(userId: number): Promise<IAppResponse<boolean>> {
    await this.sessionService.closeAllSession(userId);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS });
  }

  async closeSessionBySessionId(sessionId: string): Promise<IAppResponse<boolean>> {
    await this.sessionService.closeSession(sessionId);
    return new AppResponse({ code: AppCodes.OPERATION_SUCCESS });
  }

  async getOpenSessionBySessionId(guid: string): Promise<IAppResponse<ISession>> {
    const session = await this.sessionService.findOpenSessionByGuid(guid);
    if (!session) {
      return new AppResponse({
        code: AppCodes.NOT_FOUND,
      });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: session,
    });
  }
}
