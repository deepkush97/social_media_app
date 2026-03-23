import { Injectable } from '@nestjs/common';

import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { IAppResponse } from '@app/shared/interfaces/app-response.interface';
import { ISession } from '@app/shared/interfaces/session/session.interface';
import { INewUser, IUser } from '@app/shared/interfaces/user/users.interface';

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
}
