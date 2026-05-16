import { Body, Get, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Authenticated, CurrentUser } from 'apps/gateway/src/guards/jwt.guard';

import { AppResponse } from '@app/shared/app-response.dto';
import { ApiController } from '@app/shared/decorators/api-controller.decorator';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { ICurrentUser } from '@app/shared/interfaces/user/users.interface';

import { LoginRequest } from './requests/login.request';
import { SignupRequest } from './requests/signup.request';
import {
  AuthProfileApiResponse,
  AuthProfileTokenApiResponse,
} from './responses/auth-user.response';

import { AuthService } from './auth.service';

@ApiController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'use to signup new user' })
  @ApiBody({
    description: 'Signup body',
    type: SignupRequest,
  })
  @ApiCreatedResponse({ type: AuthProfileTokenApiResponse })
  async handleSignup(@Body() body: SignupRequest): Promise<AuthProfileTokenApiResponse> {
    return this.authService.signup(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'use to login existing user' })
  @ApiBody({
    description: 'Login body',
    type: LoginRequest,
  })
  @ApiOkResponse({ type: AuthProfileTokenApiResponse })
  async handleLogin(@Body() body: LoginRequest): Promise<AuthProfileTokenApiResponse> {
    return this.authService.login(body);
  }

  @Authenticated()
  @ApiOperation({ summary: 'use to see profile user' })
  @Get('profile')
  @ApiOkResponse({ type: AuthProfileApiResponse })
  getProfile(@CurrentUser() user: ICurrentUser): AuthProfileApiResponse {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: {
        profile: user,
      },
    });
  }

  @Authenticated()
  @ApiOperation({ summary: 'use to logout user' })
  @Post('logout')
  @ApiOkResponse()
  async handleLogout(@CurrentUser() user: ICurrentUser): Promise<AppResponse> {
    await this.authService.logout(user.sessionId);
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
    });
  }
}
